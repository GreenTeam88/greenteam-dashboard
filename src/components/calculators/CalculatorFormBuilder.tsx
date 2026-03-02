'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { createCalculator, updateCalculator } from '@/app/actions/calculatorActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculatorInfoForm } from './CalculatorInfoForm';
import { FormStepEditor } from './FormStepEditor';

import type { OptionFormData, Product, ProductStatus, QuestionFormData, StepFormData } from '@/types/calculator';

interface CalculatorFormBuilderProps {
  initialData?: Product;
  isEdit?: boolean;
}

export default function CalculatorFormBuilder({ initialData, isEdit = false }: CalculatorFormBuilderProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatorName, setCalculatorName] = useState(initialData?.name || '');
  const [calculatorSlug, setCalculatorSlug] = useState(initialData?.slug || '');
  const [calculatorDescription, setCalculatorDescription] = useState(initialData?.description || '');
  const [steps, setSteps] = useState<StepFormData[]>(() => {
    if (initialData?.steps) {
      return initialData.steps.map((step) => ({
        ...step,
        tempId: step.id || `step-${Date.now()}-${Math.random()}`,
        questions: step.questions.map((q) => ({
          ...q,
          tempId: q.id || `question-${Date.now()}-${Math.random()}`,
          options: q.options.map((o) => ({
            ...o,
            tempId: o.id || `option-${Date.now()}-${Math.random()}`,
          })),
        })),
      }));
    }
    return [];
  });
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);
  const [status, setStatus] = useState<ProductStatus>(initialData?.status || 'draft');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-generate slug from calculator name
  useEffect(() => {
    if (!isSlugManuallyEdited && calculatorName) {
      const autoSlug = calculatorName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setCalculatorSlug(autoSlug);
    }
  }, [calculatorName, isSlugManuallyEdited]);

  // --- STEP, QUESTION, AND OPTION MANAGEMENT ---

  // Step Handlers
  const addStep = () => {
    const newQuestion: QuestionFormData = {
      tempId: `question-${Date.now()}`,
      order: 0,
      type: 'SELECT',
      question: '',
      required: true,
      pricingImpact: 'NONE',
      pricePerUnit: null,
      unit: null,
      minValue: null,
      maxValue: null,
      defaultValue: null,
      placeholder: null,
      minLength: null,
      maxLength: null,
      multiline: false,
      acceptedFileTypes: null,
      maxFileSize: null,
      allowMultiple: false,
      conditionalOn: null,
      multiplyByQuestionId: null,
      variantSourceQuestionId: null,
      multipliesPriceOfQuestionId: null,
      options: [],
    };
    const newStep: StepFormData = {
      tempId: `step-${Date.now()}`,
      order: steps.length,
      description: null,
      questions: [newQuestion],
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (tempId: string, updates: Partial<StepFormData>) => {
    setSteps(steps.map((step) => (step.tempId === tempId ? { ...step, ...updates } : step)));
  };

  const deleteStep = (tempId: string) => {
    setSteps(
      steps
        .filter((step) => step.tempId !== tempId)
        .map((step, index) => ({
          ...step,
          order: index,
        }))
    );
  };

  const moveStep = (tempId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex((s) => s.tempId === tempId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps.map((step, idx) => ({ ...step, order: idx })));
  };

  // Question Handlers
  const addQuestion = (stepTempId: string) => {
    setSteps(
      steps.map((step) => {
        if (step.tempId === stepTempId) {
          const newQuestion: QuestionFormData = {
            tempId: `question-${Date.now()}`,
            order: step.questions.length,
            type: 'SELECT',
            question: '',
            required: true,
            pricingImpact: 'NONE',
            pricePerUnit: null,
            unit: null,
            minValue: null,
            maxValue: null,
            defaultValue: null,
            placeholder: null,
            minLength: null,
            maxLength: null,
            multiline: false,
            acceptedFileTypes: null,
            maxFileSize: null,
            allowMultiple: false,
            conditionalOn: null,
            multiplyByQuestionId: null,
            variantSourceQuestionId: null,
            multipliesPriceOfQuestionId: null,
            options: [],
          };
          return { ...step, questions: [...step.questions, newQuestion] };
        }
        return step;
      })
    );
  };

  const updateQuestion = (stepTempId: string, questionTempId: string, updates: Partial<QuestionFormData>) => {
    setSteps(
      steps.map((step) => {
        if (step.tempId === stepTempId) {
          return {
            ...step,
            questions: step.questions.map((q) => (q.tempId === questionTempId ? { ...q, ...updates } : q)),
          };
        }
        return step;
      })
    );
  };

  const deleteQuestion = (stepTempId: string, questionTempId: string) => {
    setSteps(
      steps.map((step) => {
        if (step.tempId === stepTempId) {
          return {
            ...step,
            questions: step.questions
              .filter((q) => q.tempId !== questionTempId)
              .map((q, index) => ({ ...q, order: index })),
          };
        }
        return step;
      })
    );
  };

  // Option Handlers
  const addOption = (stepTempId: string, questionTempId: string) => {
    setSteps(
      steps.map((step) => {
        if (step.tempId === stepTempId) {
          const newQuestions = step.questions.map((q) => {
            if (q.tempId === questionTempId) {
              const newOption: OptionFormData = {
                tempId: `option-${Date.now()}-${Math.random()}`,
                label: '',
                value: '',
                price: null,
                imageUrl: null,
                imagePublicId: null,
                order: q.options.length,
              };
              return { ...q, options: [...q.options, newOption] };
            }
            return q;
          });
          return { ...step, questions: newQuestions };
        }
        return step;
      })
    );
  };

  const updateOption = (
    stepTempId: string,
    questionTempId: string,
    optionTempId: string,
    updates: Partial<OptionFormData>
  ) => {
    setSteps(
      steps.map((step) => {
        if (step.tempId === stepTempId) {
          return {
            ...step,
            questions: step.questions.map((q) => {
              if (q.tempId === questionTempId) {
                return {
                  ...q,
                  options: q.options.map((opt) => (opt.tempId === optionTempId ? { ...opt, ...updates } : opt)),
                };
              }
              return q;
            }),
          };
        }
        return step;
      })
    );
  };

  const deleteOption = (stepTempId: string, questionTempId: string, optionTempId: string) => {
    setSteps(
      steps.map((step) => {
        if (step.tempId === stepTempId) {
          return {
            ...step,
            questions: step.questions.map((q) => {
              if (q.tempId === questionTempId) {
                return {
                  ...q,
                  options: q.options
                    .filter((opt) => opt.tempId !== optionTempId)
                    .map((opt, index) => ({ ...opt, order: index })),
                };
              }
              return q;
            }),
          };
        }
        return step;
      })
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSteps((currentSteps) => {
        const oldIndex = currentSteps.findIndex((s) => s.tempId === active.id);
        const newIndex = currentSteps.findIndex((s) => s.tempId === over.id);

        const newOrder = arrayMove(currentSteps, oldIndex, newIndex);
        return newOrder.map((step, index) => ({ ...step, order: index }));
      });
    }
  };

  // --- SUBMISSION LOGIC ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = calculatorSlug || calculatorName.toLowerCase().replace(/\s+/g, '-');

      // Get form data to capture local state from inputs
      const formData = new FormData(e.target as HTMLFormElement);

      // Build steps with descriptions from form inputs
      const stepsWithDescriptions = steps.map((step) => {
        const descriptionFromForm = formData.get(`step-${step.tempId}-description`) as string;
        return {
          ...step,
          description: descriptionFromForm || step.description || null,
        };
      });

      /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
      const data = {
        name: calculatorName,
        slug,
        description: calculatorDescription || null,
        baseImageUrl: null,
        baseImagePublicId: null,
        status,
        steps: stepsWithDescriptions.map(({ tempId: stepTempId, id: stepId, ...s }) => ({
          ...s,
          tempId: stepTempId,
          questions: s.questions.map(({ tempId: questionTempId, id: questionId, options, ...q }) => ({
            ...q,
            tempId: questionTempId,
            options: options.map(({ tempId: optionTempId, id: optionId, ...o }) => o),
          })),
        })),
      };
      /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */

      const result =
        isEdit && initialData?.id ? await updateCalculator(initialData.id, data) : await createCalculator(data);

      if (result.success) {
        toast.success(`Calculator ${isEdit ? 'updated' : 'created'} successfully!`);
        if (!isEdit) {
          router.push('/dashboard/calculators');
        }
      } else {
        toast.error(result.error || 'Failed to save calculator');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving the calculator');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submission Header - Sticky */}
      <div className="sticky top-0 z-20 flex items-center justify-end gap-4 rounded-lg bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={status === 'published'}
            onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-gray-300 text-bgPrimaryGreen focus:ring-bgPrimaryGreen"
          />
          <span className="text-sm">Published</span>
        </label>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-bgPrimaryGreen hover:bg-bgPrimaryGreen/90" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Calculator' : 'Save Calculator'}
        </Button>
      </div>

      {/* Calculator Information */}
      <CalculatorInfoForm
        calculatorName={calculatorName}
        setCalculatorName={setCalculatorName}
        calculatorSlug={calculatorSlug}
        setCalculatorSlug={setCalculatorSlug}
        setIsSlugManuallyEdited={setIsSlugManuallyEdited}
        calculatorDescription={calculatorDescription}
        setCalculatorDescription={setCalculatorDescription}
      />

      {/* Form Steps Builder */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-bgLightGreen to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bgPrimaryGreen text-white">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-textGreenPrimary">Calculator Steps</CardTitle>
                <p className="text-sm text-gray-500">
                  {steps.length === 0
                    ? 'Add steps to build your calculator form'
                    : `${steps.length} step${steps.length !== 1 ? 's' : ''} configured`}
                </p>
              </div>
            </div>
            <Button type="button" onClick={addStep} size="sm" className="bg-bgPrimaryGreen hover:bg-bgPrimaryGreen/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 bg-gray-50/50 p-6">
          {steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bgLightGreen">
                <Plus className="h-8 w-8 text-textGreenPrimary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No steps yet</h3>
              <p className="mb-6 max-w-sm text-center text-sm text-gray-500">
                Start building your calculator by adding your first step. Each step can contain multiple questions.
              </p>
              <Button type="button" onClick={addStep} className="bg-bgPrimaryGreen hover:bg-bgPrimaryGreen/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Step
              </Button>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={steps.map((s) => s.tempId!)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <FormStepEditor
                      key={step.tempId}
                      step={step}
                      index={index}
                      allSteps={steps}
                      updateStep={updateStep}
                      deleteStep={deleteStep}
                      moveStep={moveStep}
                      addQuestion={addQuestion}
                      updateQuestion={updateQuestion}
                      deleteQuestion={deleteQuestion}
                      addOption={addOption}
                      updateOption={updateOption}
                      deleteOption={deleteOption}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
          {steps.length > 0 && (
            <div className="flex items-center justify-center border-t border-gray-200 pt-6">
              <Button
                type="button"
                onClick={addStep}
                variant="outline"
                className="border-dashed border-gray-300 text-gray-600 hover:border-bgPrimaryGreen hover:bg-bgLightGreen hover:text-textGreenPrimary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Step
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

    </form>
  );
}
