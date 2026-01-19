'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

import type { ActionResult, Product, ProductFormData, ProductTableRow } from '@/types/calculator';

// ============================================
// SHARED TYPES AND HELPERS FOR CONDITIONAL LOGIC
// ============================================

// Type for simple conditional logic
interface SimpleConditionalBase {
  questionId: string;
  value: string;
  values?: string[];
}

// Type for complex conditional logic with AND/OR
interface ComplexConditionalBase {
  operator: 'AND' | 'OR';
  conditions: SimpleConditionalBase[];
}

type ConditionalOnBase = SimpleConditionalBase | ComplexConditionalBase | null;

// Helper to check if conditional is complex (has operator)
function isComplexConditionalBase(cond: unknown): cond is ComplexConditionalBase {
  return cond !== null && typeof cond === 'object' && 'operator' in cond && 'conditions' in cond;
}

// Helper to check if conditional is simple (has questionId directly)
function isSimpleConditionalBase(cond: unknown): cond is SimpleConditionalBase {
  return cond !== null && typeof cond === 'object' && 'questionId' in cond && !('operator' in cond);
}

// Helper to remap question IDs in conditional logic
function remapConditionalIdsBase(
  conditionalOn: ConditionalOnBase,
  questionIdMap: Map<string, string>
): ConditionalOnBase {
  if (!conditionalOn) return null;

  if (isComplexConditionalBase(conditionalOn)) {
    // Complex conditional with operator and conditions array
    const remappedConditions = conditionalOn.conditions.map((condition) => {
      const realQuestionId = questionIdMap.get(condition.questionId) || condition.questionId;
      return {
        ...condition,
        questionId: realQuestionId,
      };
    });
    return {
      operator: conditionalOn.operator,
      conditions: remappedConditions,
    };
  } else if (isSimpleConditionalBase(conditionalOn)) {
    // Simple conditional
    const realQuestionId = questionIdMap.get(conditionalOn.questionId) || conditionalOn.questionId;
    return {
      ...conditionalOn,
      questionId: realQuestionId,
    };
  }

  return conditionalOn;
}

// ============================================
// CREATE CALCULATOR
// ============================================
export async function createCalculator(formData: ProductFormData): Promise<ActionResult> {
  try {
    if (!formData.name || !formData.slug) {
      return { success: false, error: 'Calculator name and slug are required' };
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug: formData.slug },
    });

    if (existingProduct) {
      return { success: false, error: 'A calculator with this slug already exists' };
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // Create the product
        const product = await tx.product.create({
          data: {
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            baseImageUrl: formData.baseImageUrl || null,
            baseImagePublicId: formData.baseImagePublicId || null,
            status: formData.status || 'draft',
          },
        });

        // Map to track temp IDs to real IDs for conditional logic
        const questionIdMap = new Map<string, string>();
        const questionsToUpdate: { id: string; conditionalOn: ConditionalOnBase }[] = [];

        // Create steps and questions
        for (const stepData of formData.steps) {
          const step = await tx.formStep.create({
            data: {
              productId: product.id,
              description: stepData.description || null,
              order: stepData.order,
            },
          });

          for (const questionData of stepData.questions) {
            const questionRecord = questionData as unknown as Record<string, unknown>;
            /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
            const {
              tempId,
              options,
              conditionalOn,
              id: questionId,
              stepId,
              createdAt,
              updatedAt,
              ...restOfQuestion
            } = questionRecord;
            /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */

            // Clean up option data
            const optionsArray = options as Record<string, unknown>[] | undefined;
            const cleanedOptions = optionsArray?.map((o) => {
              /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
              const { tempId, id, questionId, createdAt, updatedAt, ...optionData } = o;
              /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */
              // Remove undefined values
              const cleaned: Record<string, unknown> = {};
              for (const [key, value] of Object.entries(optionData)) {
                if (value !== undefined) {
                  cleaned[key] = value;
                }
              }
              return cleaned;
            });

            const question = await tx.question.create({
              data: {
                stepId: step.id,
                ...(restOfQuestion as object),
                options: cleanedOptions
                  ? {
                      create: cleanedOptions as Prisma.StepOptionCreateWithoutQuestionInput[],
                    }
                  : undefined,
              } as Prisma.QuestionUncheckedCreateInput,
            });

            // Track ID mapping - both tempId and original id
            if (tempId) {
              questionIdMap.set(tempId as string, question.id);
            }
            if (questionId) {
              questionIdMap.set(questionId as string, question.id);
            }

            // Queue conditional logic updates for second pass
            if (conditionalOn) {
              questionsToUpdate.push({ id: question.id, conditionalOn: conditionalOn as ConditionalOnBase });
            }
          }
        }

        // Second pass: update conditional logic and multiplyByQuestionId with remapped IDs
        for (const { id, conditionalOn } of questionsToUpdate) {
          const remappedConditional = remapConditionalIdsBase(conditionalOn, questionIdMap);
          if (remappedConditional) {
            await tx.question.update({
              where: { id },
              data: {
                conditionalOn: remappedConditional as unknown as Prisma.InputJsonValue,
              },
            });
          }
        }

        // Third pass: update multiplyByQuestionId and variantSourceQuestionId references
        const allQuestions = await tx.question.findMany({
          where: {
            step: {
              productId: product.id,
            },
          },
        });

        for (const q of allQuestions) {
          const updates: { multiplyByQuestionId?: string; variantSourceQuestionId?: string; multipliesPriceOfQuestionId?: string } = {};

          if (q.multiplyByQuestionId) {
            const remappedId = questionIdMap.get(q.multiplyByQuestionId);
            if (remappedId && remappedId !== q.multiplyByQuestionId) {
              updates.multiplyByQuestionId = remappedId;
            }
          }

          if (q.variantSourceQuestionId) {
            const remappedId = questionIdMap.get(q.variantSourceQuestionId);
            if (remappedId && remappedId !== q.variantSourceQuestionId) {
              updates.variantSourceQuestionId = remappedId;
            }
          }

          if (q.multipliesPriceOfQuestionId) {
            const remappedId = questionIdMap.get(q.multipliesPriceOfQuestionId);
            if (remappedId && remappedId !== q.multipliesPriceOfQuestionId) {
              updates.multipliesPriceOfQuestionId = remappedId;
            }
          }

          if (Object.keys(updates).length > 0) {
            await tx.question.update({
              where: { id: q.id },
              data: updates,
            });
          }
        }

        return product;
      },
      { timeout: 15000 }
    );

    revalidatePath('/dashboard/calculators');

    return { success: true, message: 'Calculator created successfully', data: result as Product };
  } catch (error) {
    console.error('Error creating calculator:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create calculator';
    return { success: false, error: errorMessage };
  }
}

// ============================================
// UPDATE CALCULATOR
// ============================================
export async function updateCalculator(productId: string, formData: ProductFormData): Promise<ActionResult> {
  try {
    console.log('=== UPDATE CALCULATOR START ===');
    console.log('Product ID:', productId);
    console.log('Form Data:', JSON.stringify(formData, null, 2));

    if (!formData.name || !formData.slug) {
      return { success: false, error: 'Calculator name and slug are required' };
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return { success: false, error: 'Calculator not found' };
    }

    // Check for slug conflicts
    const slugConflict = await prisma.product.findFirst({
      where: {
        slug: formData.slug,
        id: { not: productId },
      },
    });

    if (slugConflict) {
      return { success: false, error: 'This slug is already used by another calculator' };
    }

    console.log('Starting transaction...');
    await prisma.$transaction(
      async (tx) => {
        // Update product basic info
        await tx.product.update({
          where: { id: productId },
          data: {
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            baseImageUrl: formData.baseImageUrl || null,
            baseImagePublicId: formData.baseImagePublicId || null,
            status: formData.status || 'draft',
          },
        });

        // Delete old steps (cascades to questions and options)
        await tx.formStep.deleteMany({ where: { productId } });

        // Re-create steps, questions, and options
        const questionIdMap = new Map<string, string>();
        const questionsToUpdate: { id: string; conditionalOn: ConditionalOnBase }[] = [];

        for (const stepData of formData.steps) {
          console.log(`Creating step ${stepData.order}:`, stepData.description);
          const step = await tx.formStep.create({
            data: {
              productId: productId,
              description: stepData.description || null,
              order: stepData.order,
            },
          });

          for (const questionData of stepData.questions) {
            const questionRecord = questionData as unknown as Record<string, unknown>;
            /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
            const {
              tempId,
              options,
              conditionalOn,
              id: questionId,
              stepId,
              createdAt,
              updatedAt,
              ...restOfQuestion
            } = questionRecord;
            /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */

            console.log(`Creating question:`, restOfQuestion.question);
            console.log(`Options count:`, (options as unknown[])?.length || 0);
            console.log(`ConditionalOn:`, JSON.stringify(conditionalOn));

            // Clean up option data - remove fields that shouldn't be in nested create
            const optionsArray = options as Record<string, unknown>[] | undefined;
            const cleanedOptions = optionsArray?.map((o) => {
              /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
              const { tempId, id, questionId, createdAt, updatedAt, ...optionData } = o;
              /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */
              // Remove undefined values
              const cleaned: Record<string, unknown> = {};
              for (const [key, value] of Object.entries(optionData)) {
                if (value !== undefined) {
                  cleaned[key] = value;
                }
              }
              return cleaned;
            });

            const question = await tx.question.create({
              data: {
                stepId: step.id,
                ...(restOfQuestion as object),
                options: cleanedOptions
                  ? {
                      create: cleanedOptions as Prisma.StepOptionCreateWithoutQuestionInput[],
                    }
                  : undefined,
              } as Prisma.QuestionUncheckedCreateInput,
            });

            // Track ID mapping - both tempId and original id
            if (tempId) {
              questionIdMap.set(tempId as string, question.id);
            }
            if (questionId) {
              questionIdMap.set(questionId as string, question.id);
            }

            // Queue conditional logic updates for second pass
            if (conditionalOn) {
              questionsToUpdate.push({ id: question.id, conditionalOn: conditionalOn as ConditionalOnBase });
            }
          }
        }

        console.log('Question ID Map:', Object.fromEntries(questionIdMap));
        console.log('Questions to update:', questionsToUpdate.length);

        // Second pass: update conditional logic with remapped IDs
        for (const { id, conditionalOn } of questionsToUpdate) {
          const remappedConditional = remapConditionalIdsBase(conditionalOn, questionIdMap);
          console.log(`Updating question ${id} with conditional:`, JSON.stringify(remappedConditional));

          if (remappedConditional) {
            await tx.question.update({
              where: { id },
              data: {
                conditionalOn: remappedConditional as unknown as Prisma.InputJsonValue,
              },
            });
          }
        }

        // Third pass: update multiplyByQuestionId and variantSourceQuestionId references
        const allQuestions = await tx.question.findMany({
          where: {
            step: {
              productId: productId,
            },
          },
        });

        for (const q of allQuestions) {
          const updates: { multiplyByQuestionId?: string; variantSourceQuestionId?: string; multipliesPriceOfQuestionId?: string } = {};

          if (q.multiplyByQuestionId) {
            const remappedId = questionIdMap.get(q.multiplyByQuestionId);
            if (remappedId && remappedId !== q.multiplyByQuestionId) {
              updates.multiplyByQuestionId = remappedId;
            }
          }

          if (q.variantSourceQuestionId) {
            const remappedId = questionIdMap.get(q.variantSourceQuestionId);
            if (remappedId && remappedId !== q.variantSourceQuestionId) {
              updates.variantSourceQuestionId = remappedId;
            }
          }

          if (q.multipliesPriceOfQuestionId) {
            const remappedId = questionIdMap.get(q.multipliesPriceOfQuestionId);
            if (remappedId && remappedId !== q.multipliesPriceOfQuestionId) {
              updates.multipliesPriceOfQuestionId = remappedId;
            }
          }

          if (Object.keys(updates).length > 0) {
            await tx.question.update({
              where: { id: q.id },
              data: updates,
            });
          }
        }
      },
      { timeout: 15000 }
    );

    console.log('=== UPDATE CALCULATOR SUCCESS ===');
    revalidatePath('/dashboard/calculators');
    revalidatePath(`/dashboard/calculators/${productId}/edit`);

    return { success: true, message: 'Calculator updated successfully' };
  } catch (error) {
    console.error('=== UPDATE CALCULATOR ERROR ===');
    console.error('Error updating calculator:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update calculator';
    return { success: false, error: errorMessage };
  }
}

// ============================================
// DELETE CALCULATOR
// ============================================
export async function deleteCalculator(productId: string): Promise<ActionResult> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: 'Calculator not found' };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/dashboard/calculators');

    return { success: true, message: 'Calculator deleted successfully' };
  } catch (error) {
    console.error('Error deleting calculator:', error);
    return { success: false, error: 'Failed to delete calculator' };
  }
}

// ============================================
// DUPLICATE CALCULATOR
// ============================================
export async function duplicateCalculator(productId: string): Promise<ActionResult> {
  try {
    const original = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        steps: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { order: 'asc' },
              include: {
                options: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!original) {
      return { success: false, error: 'Calculator not found' };
    }

    // Generate unique slug
    let newSlug = `${original.slug}-copy`;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${original.slug}-copy-${counter}`;
      counter++;
    }

    // Track counts for the table row response
    let stepsCount = 0;
    let questionsCount = 0;

    const result = await prisma.$transaction(
      async (tx) => {
        const newProduct = await tx.product.create({
          data: {
            name: `${original.name} (Copy)`,
            slug: newSlug,
            description: original.description,
            baseImageUrl: original.baseImageUrl,
            baseImagePublicId: original.baseImagePublicId,
            status: 'draft',
          },
        });

        const questionIdMap = new Map<string, string>();
        const questionsToUpdate: { id: string; conditionalOn: { questionId: string; value: string } }[] = [];

        for (const step of original.steps) {
          stepsCount++;
          const newStep = await tx.formStep.create({
            data: {
              productId: newProduct.id,
              order: step.order,
              description: step.description,
            },
          });

          for (const question of step.questions) {
            questionsCount++;
            const newQuestion = await tx.question.create({
              data: {
                stepId: newStep.id,
                order: question.order,
                type: question.type,
                question: question.question,
                required: question.required,
                pricingImpact: question.pricingImpact,
                pricePerUnit: question.pricePerUnit,
                unit: question.unit,
                minValue: question.minValue,
                maxValue: question.maxValue,
                defaultValue: question.defaultValue,
                placeholder: question.placeholder,
                minLength: question.minLength,
                maxLength: question.maxLength,
                multiline: question.multiline,
                acceptedFileTypes: question.acceptedFileTypes,
                maxFileSize: question.maxFileSize,
                allowMultiple: question.allowMultiple,
                countThreshold: question.countThreshold,
                // multiplyByQuestionId will be updated in a second pass
                options: {
                  create: question.options.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                    price: opt.price,
                    imageUrl: opt.imageUrl,
                    imagePublicId: opt.imagePublicId,
                    order: opt.order,
                    isExclusive: opt.isExclusive,
                  })),
                },
              },
            });

            questionIdMap.set(question.id, newQuestion.id);

            if (question.conditionalOn) {
              const conditionalOn = question.conditionalOn as { questionId: string; value: string };
              questionsToUpdate.push({ id: newQuestion.id, conditionalOn });
            }
          }
        }

        // Update conditional references
        for (const { id, conditionalOn } of questionsToUpdate) {
          const newQuestionId = questionIdMap.get(conditionalOn.questionId);
          if (newQuestionId) {
            await tx.question.update({
              where: { id },
              data: {
                conditionalOn: {
                  questionId: newQuestionId,
                  value: conditionalOn.value,
                },
              },
            });
          }
        }

        // Update multiplyByQuestionId, variantSourceQuestionId, and multipliesPriceOfQuestionId references
        for (const step of original.steps) {
          for (const question of step.questions) {
            const updates: { multiplyByQuestionId?: string; variantSourceQuestionId?: string; multipliesPriceOfQuestionId?: string } = {};

            if (question.multiplyByQuestionId) {
              const newMultiplyById = questionIdMap.get(question.multiplyByQuestionId);
              if (newMultiplyById) {
                updates.multiplyByQuestionId = newMultiplyById;
              }
            }

            if (question.variantSourceQuestionId) {
              const newVariantSourceId = questionIdMap.get(question.variantSourceQuestionId);
              if (newVariantSourceId) {
                updates.variantSourceQuestionId = newVariantSourceId;
              }
            }

            if (question.multipliesPriceOfQuestionId) {
              const newMultipliesPriceOfId = questionIdMap.get(question.multipliesPriceOfQuestionId);
              if (newMultipliesPriceOfId) {
                updates.multipliesPriceOfQuestionId = newMultipliesPriceOfId;
              }
            }

            if (Object.keys(updates).length > 0) {
              const newQuestionId = questionIdMap.get(question.id);
              if (newQuestionId) {
                await tx.question.update({
                  where: { id: newQuestionId },
                  data: updates,
                });
              }
            }
          }
        }

        return newProduct;
      },
      { timeout: 15000 }
    );

    revalidatePath('/dashboard/calculators');

    // Return table row format for immediate UI update
    const tableRow: ProductTableRow = {
      id: result.id,
      name: result.name,
      slug: result.slug,
      status: result.status as 'draft' | 'published',
      stepsCount,
      questionsCount,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return { success: true, message: 'Calculator duplicated successfully', data: tableRow };
  } catch (error) {
    console.error('Error duplicating calculator:', error);
    return { success: false, error: 'Failed to duplicate calculator' };
  }
}

// ============================================
// PUBLISH / UNPUBLISH
// ============================================
export async function publishCalculator(productId: string): Promise<ActionResult> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { status: 'published' },
    });

    revalidatePath('/dashboard/calculators');

    return { success: true, message: 'Calculator published successfully' };
  } catch (error) {
    console.error('Error publishing calculator:', error);
    return { success: false, error: 'Failed to publish calculator' };
  }
}

export async function unpublishCalculator(productId: string): Promise<ActionResult> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { status: 'draft' },
    });

    revalidatePath('/dashboard/calculators');

    return { success: true, message: 'Calculator unpublished successfully' };
  } catch (error) {
    console.error('Error unpublishing calculator:', error);
    return { success: false, error: 'Failed to unpublish calculator' };
  }
}

// ============================================
// FETCH OPERATIONS
// ============================================
export async function getAllCalculators(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        steps: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { order: 'asc' },
              include: {
                options: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => ({
      ...product,
      status: product.status as 'draft' | 'published',
      steps: product.steps.map((step) => ({
        ...step,
        questions: step.questions.map((question) => ({
          ...question,
          type: question.type as 'SELECT' | 'NUMBER' | 'TEXT' | 'CHECKBOX' | 'FILE_UPLOAD',
          pricingImpact: question.pricingImpact as 'BASE' | 'MULTIPLIER' | 'ADDITIVE' | 'NONE' | 'COUNT_SELECTED',
          conditionalOn: question.conditionalOn as ConditionalOnBase,
        })),
      })),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching calculators:', error);
    return [];
  }
}

export async function getCalculatorById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { order: 'asc' },
              include: {
                options: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      status: product.status as 'draft' | 'published',
      steps: product.steps.map((step) => ({
        ...step,
        questions: step.questions.map((question) => ({
          ...question,
          type: question.type as 'SELECT' | 'NUMBER' | 'TEXT' | 'CHECKBOX' | 'FILE_UPLOAD',
          pricingImpact: question.pricingImpact as 'BASE' | 'MULTIPLIER' | 'ADDITIVE' | 'NONE' | 'COUNT_SELECTED',
          conditionalOn: question.conditionalOn as ConditionalOnBase,
        })),
      })),
    } as Product;
  } catch (error) {
    console.error('Error fetching calculator:', error);
    return null;
  }
}

export async function getCalculatorBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        steps: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { order: 'asc' },
              include: {
                options: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      status: product.status as 'draft' | 'published',
      steps: product.steps.map((step) => ({
        ...step,
        questions: step.questions.map((question) => ({
          ...question,
          type: question.type as 'SELECT' | 'NUMBER' | 'TEXT' | 'CHECKBOX' | 'FILE_UPLOAD',
          pricingImpact: question.pricingImpact as 'BASE' | 'MULTIPLIER' | 'ADDITIVE' | 'NONE' | 'COUNT_SELECTED',
          conditionalOn: question.conditionalOn as ConditionalOnBase,
        })),
      })),
    } as Product;
  } catch (error) {
    console.error('Error fetching calculator:', error);
    return null;
  }
}

// ============================================
// TABLE DATA
// ============================================
export async function getCalculatorsForTable(): Promise<ProductTableRow[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        steps: {
          include: {
            questions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      status: product.status as 'draft' | 'published',
      stepsCount: product.steps.length,
      questionsCount: product.steps.reduce((acc, step) => acc + step.questions.length, 0),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching calculators for table:', error);
    return [];
  }
}
