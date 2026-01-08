import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ConditionalRule {
  questionId: string;
  value: string;
}

interface ConditionalLogic {
  operator: 'AND' | 'OR';
  conditions: ConditionalRule[];
}

type ConditionalOn = ConditionalRule | ConditionalLogic | null;

// Helper to update conditional logic with real question IDs
function updateConditionalIds(
  conditionalOn: ConditionalOn,
  questionMap: Map<string, string>
): ConditionalOn {
  if (!conditionalOn) return null;

  // Check if it's a ConditionalLogic (has operator)
  if ('operator' in conditionalOn && 'conditions' in conditionalOn) {
    return {
      operator: conditionalOn.operator,
      conditions: conditionalOn.conditions.map((cond) => ({
        ...cond,
        questionId: questionMap.get(cond.questionId) || cond.questionId,
      })),
    };
  }

  // It's a single ConditionalRule
  if ('questionId' in conditionalOn) {
    return {
      ...conditionalOn,
      questionId: questionMap.get(conditionalOn.questionId) || conditionalOn.questionId,
    };
  }

  return conditionalOn;
}

async function fixParketrenovatie() {
  console.log('Fixing Parketrenovatie conditional logic...');

  const product = await prisma.product.findUnique({
    where: { slug: 'parketrenovatie' },
    include: {
      steps: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!product) {
    console.log('Parketrenovatie not found');
    return;
  }

  // Build question map: step[order].question[order] -> actual ID
  const questionsByStep: Record<number, Record<number, string>> = {};
  for (const step of product.steps) {
    questionsByStep[step.order] = {};
    for (const q of step.questions) {
      questionsByStep[step.order][q.order] = q.id;
    }
  }

  // Step 2 (order 2): Question 1 depends on Step 2 Question 0 (damage)
  // Step 3 (order 3): Questions depend on Step 3 Question 0 (surfaces1)
  // Step 4 (order 4): Questions depend on Step 4 Question 0 (surfaces2)
  // Step 5 (order 5): Question 1 depends on Step 5 Question 0 (plinten)

  const updates: Array<{ id: string; conditionalOn: any }> = [];

  // Step 2 (index 2): damage assessment
  if (questionsByStep[2]) {
    const damageQuestionId = questionsByStep[2][0];
    const repairsQuestionId = questionsByStep[2][1];
    if (damageQuestionId && repairsQuestionId) {
      updates.push({
        id: repairsQuestionId,
        conditionalOn: { questionId: damageQuestionId, value: 'Ja' },
      });
    }
  }

  // Step 3 (index 3): additional surfaces 1
  if (questionsByStep[3]) {
    const surfacesQuestionId = questionsByStep[3][0];
    // Questions 1-5 depend on different values from question 0
    const conditionalMappings = [
      { qIndex: 1, values: ['Traptredes', 'Opstapjes'] }, // steps/opstapjes
      { qIndex: 2, values: ['Drempels', 'Dorpels'] }, // drempels/dorpels
      { qIndex: 3, values: ['Vensterbanken'] }, // vensterbanken
      { qIndex: 4, values: ['Planken'] }, // planken
      { qIndex: 5, values: ['Tafels'] }, // tafels
    ];

    for (const mapping of conditionalMappings) {
      const targetQuestionId = questionsByStep[3][mapping.qIndex];
      if (targetQuestionId && surfacesQuestionId) {
        if (mapping.values.length === 1) {
          updates.push({
            id: targetQuestionId,
            conditionalOn: { questionId: surfacesQuestionId, value: mapping.values[0] },
          });
        } else {
          updates.push({
            id: targetQuestionId,
            conditionalOn: {
              operator: 'OR',
              conditions: mapping.values.map((v) => ({
                questionId: surfacesQuestionId,
                value: v,
              })),
            },
          });
        }
      }
    }
  }

  // Step 4 (index 4): additional surfaces 2
  if (questionsByStep[4]) {
    const surfaces2QuestionId = questionsByStep[4][0];
    const conditionalMappings = [
      { qIndex: 1, value: 'Convector-boven' },
      { qIndex: 2, value: 'Convector-achter' },
      { qIndex: 3, value: 'Radiator' },
      { qIndex: 4, value: 'Witte-vloer' },
    ];

    for (const mapping of conditionalMappings) {
      const targetQuestionId = questionsByStep[4][mapping.qIndex];
      if (targetQuestionId && surfaces2QuestionId) {
        updates.push({
          id: targetQuestionId,
          conditionalOn: { questionId: surfaces2QuestionId, value: mapping.value },
        });
      }
    }
  }

  // Step 5 (index 5): plinten
  if (questionsByStep[5]) {
    const plintenQuestionId = questionsByStep[5][0];
    const metersQuestionId = questionsByStep[5][1];
    if (plintenQuestionId && metersQuestionId) {
      updates.push({
        id: metersQuestionId,
        conditionalOn: {
          operator: 'OR',
          conditions: [
            { questionId: plintenQuestionId, value: 'lage' },
            { questionId: plintenQuestionId, value: 'hoge' },
          ],
        },
      });
    }
  }

  // Apply updates
  for (const update of updates) {
    await prisma.question.update({
      where: { id: update.id },
      data: { conditionalOn: update.conditionalOn },
    });
  }

  console.log(`  Updated ${updates.length} questions`);
}

async function fixVloerenLeggen() {
  console.log('Fixing Vloeren Leggen conditional logic...');

  const product = await prisma.product.findUnique({
    where: { slug: 'vloeren-leggen' },
    include: {
      steps: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!product) {
    console.log('Vloeren Leggen not found');
    return;
  }

  const questionsByStep: Record<number, Record<number, string>> = {};
  for (const step of product.steps) {
    questionsByStep[step.order] = {};
    for (const q of step.questions) {
      questionsByStep[step.order][q.order] = q.id;
    }
  }

  const updates: Array<{ id: string; conditionalOn: any }> = [];

  // Step 0: floor type selection
  const floorTypeQuestionId = questionsByStep[0]?.[0];

  // Step 1: sub-services depend on floor type
  if (questionsByStep[1] && floorTypeQuestionId) {
    const subServiceMappings = [
      { qIndex: 0, value: 'Parket' },
      { qIndex: 1, value: 'Laminaat' },
      { qIndex: 2, value: 'PVC-klik' },
      { qIndex: 3, value: 'PVC-plak' },
      { qIndex: 4, value: 'Tapijt' },
      { qIndex: 5, value: 'Linoleum' },
    ];

    for (const mapping of subServiceMappings) {
      const targetQuestionId = questionsByStep[1][mapping.qIndex];
      if (targetQuestionId) {
        updates.push({
          id: targetQuestionId,
          conditionalOn: { questionId: floorTypeQuestionId, value: mapping.value },
        });
      }
    }
  }

  // Step 4: plinten meters depends on plinten selection
  if (questionsByStep[4]) {
    const plintenQuestionId = questionsByStep[4][0];
    const metersQuestionId = questionsByStep[4][1];
    if (plintenQuestionId && metersQuestionId) {
      updates.push({
        id: metersQuestionId,
        conditionalOn: {
          operator: 'OR',
          conditions: [
            { questionId: plintenQuestionId, value: 'lage' },
            { questionId: plintenQuestionId, value: 'hoge' },
          ],
        },
      });
    }
  }

  for (const update of updates) {
    await prisma.question.update({
      where: { id: update.id },
      data: { conditionalOn: update.conditionalOn },
    });
  }

  console.log(`  Updated ${updates.length} questions`);
}

async function fixStofferen() {
  console.log('Fixing Stofferen conditional logic...');

  const product = await prisma.product.findUnique({
    where: { slug: 'stofferen' },
    include: {
      steps: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!product) {
    console.log('Stofferen not found');
    return;
  }

  const questionsByStep: Record<number, Record<number, string>> = {};
  for (const step of product.steps) {
    questionsByStep[step.order] = {};
    for (const q of step.questions) {
      questionsByStep[step.order][q.order] = q.id;
    }
  }

  const updates: Array<{ id: string; conditionalOn: any }> = [];

  // Step 3: plinten meters depends on plinten selection
  if (questionsByStep[3]) {
    const plintenQuestionId = questionsByStep[3][0];
    const metersQuestionId = questionsByStep[3][1];
    if (plintenQuestionId && metersQuestionId) {
      updates.push({
        id: metersQuestionId,
        conditionalOn: {
          operator: 'OR',
          conditions: [
            { questionId: plintenQuestionId, value: 'lage' },
            { questionId: plintenQuestionId, value: 'hoge' },
          ],
        },
      });
    }
  }

  for (const update of updates) {
    await prisma.question.update({
      where: { id: update.id },
      data: { conditionalOn: update.conditionalOn },
    });
  }

  console.log(`  Updated ${updates.length} questions`);
}

async function fixOverig() {
  console.log('Fixing Overig conditional logic...');

  const product = await prisma.product.findUnique({
    where: { slug: 'overig' },
    include: {
      steps: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!product) {
    console.log('Overig not found');
    return;
  }

  const questionsByStep: Record<number, Record<number, string>> = {};
  for (const step of product.steps) {
    questionsByStep[step.order] = {};
    for (const q of step.questions) {
      questionsByStep[step.order][q.order] = q.id;
    }
  }

  const updates: Array<{ id: string; conditionalOn: any }> = [];

  // Step 2: additional surfaces depends on damage question
  if (questionsByStep[2]) {
    const damageQuestionId = questionsByStep[2][0];
    const surfacesQuestionId = questionsByStep[2][1];
    if (damageQuestionId && surfacesQuestionId) {
      updates.push({
        id: surfacesQuestionId,
        conditionalOn: { questionId: damageQuestionId, value: 'Ja' },
      });
    }
  }

  for (const update of updates) {
    await prisma.question.update({
      where: { id: update.id },
      data: { conditionalOn: update.conditionalOn },
    });
  }

  console.log(`  Updated ${updates.length} questions`);
}

async function fixTraprenovatie() {
  console.log('Fixing Traprenovatie conditional logic...');

  const product = await prisma.product.findUnique({
    where: { slug: 'traprenovatie' },
    include: {
      steps: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!product) {
    console.log('Traprenovatie not found');
    return;
  }

  const questionsByStep: Record<number, Record<number, string>> = {};
  for (const step of product.steps) {
    questionsByStep[step.order] = {};
    for (const q of step.questions) {
      questionsByStep[step.order][q.order] = q.id;
    }
  }

  const updates: Array<{ id: string; conditionalOn: any }> = [];

  // Step 1: open stairs total steps depends on open stairs count
  if (questionsByStep[1]) {
    const openStairsQuestionId = questionsByStep[1][0];
    const openStepsQuestionId = questionsByStep[1][1];
    if (openStairsQuestionId && openStepsQuestionId) {
      // Show when open stairs is 1-15+
      updates.push({
        id: openStepsQuestionId,
        conditionalOn: {
          operator: 'OR',
          conditions: [
            ...Array.from({ length: 14 }, (_, i) => ({
              questionId: openStairsQuestionId,
              value: String(i + 1),
            })),
            { questionId: openStairsQuestionId, value: '15+' },
          ],
        },
      });
    }
  }

  // Step 2: closed stairs total steps depends on closed stairs count
  if (questionsByStep[2]) {
    const closedStairsQuestionId = questionsByStep[2][0];
    const closedStepsQuestionId = questionsByStep[2][1];
    if (closedStairsQuestionId && closedStepsQuestionId) {
      updates.push({
        id: closedStepsQuestionId,
        conditionalOn: {
          operator: 'OR',
          conditions: [
            ...Array.from({ length: 14 }, (_, i) => ({
              questionId: closedStairsQuestionId,
              value: String(i + 1),
            })),
            { questionId: closedStairsQuestionId, value: '15+' },
          ],
        },
      });
    }
  }

  // Step 3: stair type options depend on having stairs
  if (questionsByStep[3] && questionsByStep[1] && questionsByStep[2]) {
    const openStairsQuestionId = questionsByStep[1][0];
    const closedStairsQuestionId = questionsByStep[2][0];
    const openTypeQuestionId = questionsByStep[3][0];
    const closedTypeQuestionId = questionsByStep[3][1];

    if (openTypeQuestionId) {
      updates.push({
        id: openTypeQuestionId,
        conditionalOn: {
          operator: 'OR',
          conditions: [
            ...Array.from({ length: 14 }, (_, i) => ({
              questionId: openStairsQuestionId,
              value: String(i + 1),
            })),
            { questionId: openStairsQuestionId, value: '15+' },
          ],
        },
      });
    }

    if (closedTypeQuestionId) {
      updates.push({
        id: closedTypeQuestionId,
        conditionalOn: {
          operator: 'OR',
          conditions: [
            ...Array.from({ length: 14 }, (_, i) => ({
              questionId: closedStairsQuestionId,
              value: String(i + 1),
            })),
            { questionId: closedStairsQuestionId, value: '15+' },
          ],
        },
      });
    }
  }

  for (const update of updates) {
    await prisma.question.update({
      where: { id: update.id },
      data: { conditionalOn: update.conditionalOn },
    });
  }

  console.log(`  Updated ${updates.length} questions`);
}

async function main() {
  console.log('Fixing conditional logic for all calculators...\n');

  try {
    await fixParketrenovatie();
    await fixVloerenLeggen();
    await fixStofferen();
    await fixOverig();
    await fixTraprenovatie();

    console.log('\n=== All conditional logic fixed! ===');
  } catch (error) {
    console.error('Error fixing conditional logic:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
