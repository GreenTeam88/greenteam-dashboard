import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All categories for the dropdown
const allCategories = [
  { label: 'Parketrenovatie', value: 'parketrenovatie' },
  { label: 'Traprenovatie', value: 'traprenovatie' },
  { label: 'Vloeren leggen', value: 'vloeren-leggen' },
  { label: 'Stofferen', value: 'stofferen' },
  { label: 'Overig', value: 'overig' },
];

// Parketrenovatie services with base prices
const parketServices = [
  { label: 'Schuren + polijsten + (zonder behandeling) - €20.00', value: 'schuren-polijsten-zonder-behandeling', price: 20.0 },
  { label: 'Schuren + polijsten + oliën naturel - €30.00', value: 'schuren-polijsten-olien-naturel', price: 30.0 },
  { label: 'Schuren + polijsten + oliën in kleur - €35.00', value: 'schuren-polijsten-olien-kleur', price: 35.0 },
  { label: 'Schuren + polijsten + hardwax naturel - €35.00', value: 'schuren-polijsten-hardwax-naturel', price: 35.0 },
  { label: 'Schuren + polijsten + hardwax in kleur - €37.50', value: 'schuren-polijsten-hardwax-kleur', price: 37.5 },
  { label: 'Schuren + polijsten + lakken in naturel - €40.00', value: 'schuren-polijsten-lakken-naturel', price: 40.0 },
  { label: 'Schuren + polijsten + lakken in kleur - €46.50', value: 'schuren-polijsten-lakken-kleur', price: 46.5 },
  { label: 'Schuren + polijsten + lakken met Skylt - €42.50', value: 'schuren-polijsten-lakken-skylt', price: 42.5 },
  { label: 'Schuren + polijsten + olie + lak - €47.50', value: 'schuren-polijsten-olie-lak', price: 47.5 },
  { label: 'Schuren + polijsten + lak zwartmat - €65.00', value: 'schuren-polijsten-lak-zwartmat', price: 65.0 },
  { label: 'Schuren + polijsten + lak wit mat - €65.00', value: 'schuren-polijsten-lak-witmat', price: 65.0 },
  { label: 'Ben ik nog niet over uit - Gratis', value: 'ben-ik-nog-niet-over-uit', price: 0 },
  { label: 'Ik wil graag advies - Gratis', value: 'ik-wil-graag-advies', price: 0 },
];

// Floor options (0-10+)
const floorOptions = [
  { label: '0 (begane grond)', value: '0', price: 25 },
  { label: '1', value: '1', price: 25 },
  { label: '2', value: '2', price: 25 },
  { label: '3', value: '3', price: 25 },
  { label: '4', value: '4', price: 25 },
  { label: '5', value: '5', price: 25 },
  { label: '6', value: '6', price: 25 },
  { label: '7', value: '7', price: 25 },
  { label: '8', value: '8', price: 25 },
  { label: '9', value: '9', price: 25 },
  { label: '10+', value: '10+', price: 25 },
];

// Count options (1-10+) for various inputs
const countOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10+', value: '10' },
];

async function createParketRenovatieCalculator() {
  console.log('Creating Parketrenovatie Calculator...\n');

  // First, delete existing parketrenovatie calculator
  const existing = await prisma.product.findUnique({
    where: { slug: 'parketrenovatie' },
  });

  if (existing) {
    console.log('Deleting existing Parketrenovatie calculator...');
    await prisma.product.delete({ where: { id: existing.id } });
  }

  // Create the product
  const product = await prisma.product.create({
    data: {
      name: 'Parketrenovatie Calculator',
      slug: 'parketrenovatie',
      description: 'Calculator voor parketrenovatie diensten',
      status: 'published',
    },
  });

  console.log('Created product:', product.name);

  // ==========================================
  // STEP 1: Category & Service Selection
  // ==========================================
  const step1 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 0,
      description: 'Waar kunnen we u mee helpen?',
    },
  });

  // Question 1.1: Category selection
  const categoryQuestion = await prisma.question.create({
    data: {
      stepId: step1.id,
      order: 0,
      type: 'SELECT',
      question: 'Categorie',
      required: true,
      pricingImpact: 'NONE',
    },
  });

  for (let i = 0; i < allCategories.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: categoryQuestion.id,
        order: i,
        label: allCategories[i].label,
        value: allCategories[i].value,
      },
    });
  }

  // Question 1.2: Service selection (BASE PRICE)
  const serviceQuestion = await prisma.question.create({
    data: {
      stepId: step1.id,
      order: 1,
      type: 'SELECT',
      question: 'Wat wilt u gedaan hebben?',
      required: true,
      pricingImpact: 'BASE',
    },
  });

  for (let i = 0; i < parketServices.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: serviceQuestion.id,
        order: i,
        label: parketServices[i].label,
        value: parketServices[i].value,
        price: parketServices[i].price,
      },
    });
  }

  console.log('Step 1 created: Category & Service Selection');

  // ==========================================
  // STEP 2: Floor & Area
  // ==========================================
  const step2 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 1,
      description: 'Verdieping en oppervlakte',
    },
  });

  // Question 2.1: Floors (CHECKBOX - multi-select, €25 per floor selected)
  const floorQuestion = await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 0,
      type: 'CHECKBOX',
      question: 'Welke verdieping(en)?',
      required: true,
      pricingImpact: 'COUNT_SELECTED',
      pricePerUnit: 25,
      countThreshold: 0, // Count all selected items
    },
  });

  for (let i = 0; i < floorOptions.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: floorQuestion.id,
        order: i,
        label: floorOptions[i].label,
        value: floorOptions[i].value,
        price: floorOptions[i].price,
      },
    });
  }

  // Question 2.2: Square meters (MULTIPLIER - multiplies with base price)
  await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 1,
      type: 'NUMBER',
      question: 'Aantal m²',
      required: true,
      pricingImpact: 'MULTIPLIER',
      unit: 'm²',
      minValue: 1,
      placeholder: 'Voer aantal m² in',
    },
  });

  console.log('Step 2 created: Floor & Area');

  // ==========================================
  // STEP 3: Damages
  // ==========================================
  const step3 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 2,
      description: 'Beschadigingen',
    },
  });

  // Question 3.1: Has damages?
  const damagesQuestion = await prisma.question.create({
    data: {
      stepId: step3.id,
      order: 0,
      type: 'SELECT',
      question: 'Zijn er beschadigingen of reparaties nodig?',
      required: true,
      pricingImpact: 'NONE',
    },
  });

  await prisma.stepOption.create({
    data: {
      questionId: damagesQuestion.id,
      order: 0,
      label: 'Ja (Let op: Berekening volgt na aanvraag)',
      value: 'ja',
    },
  });

  await prisma.stepOption.create({
    data: {
      questionId: damagesQuestion.id,
      order: 1,
      label: 'Nee',
      value: 'nee',
    },
  });

  // Question 3.2: Number of damages (conditional on "ja")
  const damageCountQuestion = await prisma.question.create({
    data: {
      stepId: step3.id,
      order: 1,
      type: 'SELECT',
      question: 'Aantal beschadigingen of reparaties',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: {
        questionId: damagesQuestion.id,
        value: 'ja',
      },
    },
  });

  for (let i = 0; i < countOptions.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: damageCountQuestion.id,
        order: i,
        label: countOptions[i].label,
        value: countOptions[i].value,
      },
    });
  }

  // Question 3.3: Photo upload (conditional on "ja")
  await prisma.question.create({
    data: {
      stepId: step3.id,
      order: 2,
      type: 'FILE_UPLOAD',
      question: 'Upload foto van beschadigingen',
      required: false,
      pricingImpact: 'NONE',
      allowMultiple: true,
      conditionalOn: {
        questionId: damagesQuestion.id,
        value: 'ja',
      },
    },
  });

  console.log('Step 3 created: Damages');

  // ==========================================
  // STEP 4: Other Surfaces (1/2)
  // ==========================================
  const step4 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 3,
      description: 'Andere oppervlaktes (1/2)',
    },
  });

  // Question 4.1: Other surfaces selection
  const surfaces1Question = await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 0,
      type: 'CHECKBOX',
      question: 'Zijn er nog andere oppervlaktes? (1/2)',
      required: true,
      pricingImpact: 'NONE',
    },
  });

  // Options for surfaces (Nee is exclusive)
  const surfaceOptions1 = [
    { label: 'Nee', value: 'nee', isExclusive: true },
    { label: 'Trapredes', value: 'trapredes', isExclusive: false },
    { label: 'Opstapjes', value: 'opstapjes', isExclusive: false },
    { label: 'Drempels', value: 'drempels', isExclusive: false },
    { label: 'Dorpels', value: 'dorpels', isExclusive: false },
    { label: 'Vensterbanken per m', value: 'vensterbanken', isExclusive: false },
    { label: 'Planken/plateaus per m', value: 'planken-plateaus', isExclusive: false },
    { label: 'Salontafels/eettafels per m²', value: 'salontafels-eettafels', isExclusive: false },
  ];

  for (let i = 0; i < surfaceOptions1.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: surfaces1Question.id,
        order: i,
        label: surfaceOptions1[i].label,
        value: surfaceOptions1[i].value,
        isExclusive: surfaceOptions1[i].isExclusive,
      },
    });
  }

  // Question 4.2: Trapredes/Opstapjes count (€50 each) - conditional
  const trapOpstapQuestion = await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 1,
      type: 'SELECT',
      question: 'Traptrede(s)/opstapje(s)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 50,
      conditionalOn: {
        operator: 'OR',
        conditions: [
          { questionId: surfaces1Question.id, value: 'trapredes' },
          { questionId: surfaces1Question.id, value: 'opstapjes' },
        ],
      },
    },
  });

  for (let i = 0; i < countOptions.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: trapOpstapQuestion.id,
        order: i,
        label: countOptions[i].label,
        value: countOptions[i].value,
      },
    });
  }

  // Question 4.3: Drempels/Dorpels count (€25 each) - conditional
  const drempelDorpelQuestion = await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 2,
      type: 'SELECT',
      question: 'Drempel(s)/dorpel(s)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 25,
      conditionalOn: {
        operator: 'OR',
        conditions: [
          { questionId: surfaces1Question.id, value: 'drempels' },
          { questionId: surfaces1Question.id, value: 'dorpels' },
        ],
      },
    },
  });

  for (let i = 0; i < countOptions.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: drempelDorpelQuestion.id,
        order: i,
        label: countOptions[i].label,
        value: countOptions[i].value,
      },
    });
  }

  // Question 4.4: Vensterbanken meters (€45 per meter) - conditional
  await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 3,
      type: 'NUMBER',
      question: 'Vensterbank(en)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 45,
      unit: 'meter',
      minValue: 1,
      placeholder: 'Aantal meter',
      conditionalOn: {
        questionId: surfaces1Question.id,
        value: 'vensterbanken',
      },
    },
  });

  // Question 4.5: Planken/Plateaus meters (€50 per meter) - conditional
  await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 4,
      type: 'NUMBER',
      question: 'Plank(en)/Plateau(s)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 50,
      unit: 'meter',
      minValue: 1,
      placeholder: 'Aantal meter',
      conditionalOn: {
        questionId: surfaces1Question.id,
        value: 'planken-plateaus',
      },
    },
  });

  // Question 4.6: Salontafels/Eettafels m² (€50 per m²) - conditional
  await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 5,
      type: 'NUMBER',
      question: 'Salontafel(s)/Eettafel(s)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 50,
      unit: 'm²',
      minValue: 1,
      placeholder: 'Aantal m²',
      conditionalOn: {
        questionId: surfaces1Question.id,
        value: 'salontafels-eettafels',
      },
    },
  });

  console.log('Step 4 created: Other Surfaces (1/2)');

  // ==========================================
  // STEP 5: Other Surfaces (2/2)
  // ==========================================
  const step5 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 4,
      description: 'Andere oppervlaktes (2/2)',
    },
  });

  // Question 5.1: Other surfaces selection
  const surfaces2Question = await prisma.question.create({
    data: {
      stepId: step5.id,
      order: 0,
      type: 'CHECKBOX',
      question: 'Zijn er nog andere oppervlaktes? (2/2)',
      required: true,
      pricingImpact: 'NONE',
    },
  });

  const surfaceOptions2 = [
    { label: 'Nee', value: 'nee', isExclusive: true },
    { label: 'Bovenkant convectorput schuren', value: 'bovenkant-convectorput', isExclusive: false },
    { label: 'Achter convectorput schuren', value: 'achter-convectorput', isExclusive: false },
    { label: 'Onderkant en achter radiator schuren', value: 'radiator-schuren', isExclusive: false },
    { label: 'Schuren witte vloer', value: 'schuren-witte-vloer', isExclusive: false },
  ];

  for (let i = 0; i < surfaceOptions2.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: surfaces2Question.id,
        order: i,
        label: surfaceOptions2[i].label,
        value: surfaceOptions2[i].value,
        isExclusive: surfaceOptions2[i].isExclusive,
      },
    });
  }

  // Question 5.2: Bovenkant convectorput count (€50 each)
  const bovenkantQuestion = await prisma.question.create({
    data: {
      stepId: step5.id,
      order: 1,
      type: 'SELECT',
      question: 'Bovenkant convectorput(ten)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 50,
      conditionalOn: {
        questionId: surfaces2Question.id,
        value: 'bovenkant-convectorput',
      },
    },
  });

  for (let i = 0; i < countOptions.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: bovenkantQuestion.id,
        order: i,
        label: countOptions[i].label,
        value: countOptions[i].value,
      },
    });
  }

  // Question 5.3: Achter convectorput count (€50 each)
  const achterConvectorQuestion = await prisma.question.create({
    data: {
      stepId: step5.id,
      order: 2,
      type: 'SELECT',
      question: 'Achter convectorput(ten)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 50,
      conditionalOn: {
        questionId: surfaces2Question.id,
        value: 'achter-convectorput',
      },
    },
  });

  for (let i = 0; i < countOptions.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: achterConvectorQuestion.id,
        order: i,
        label: countOptions[i].label,
        value: countOptions[i].value,
      },
    });
  }

  // Question 5.4: Radiator schuren count (€50 each)
  const radiatorQuestion = await prisma.question.create({
    data: {
      stepId: step5.id,
      order: 3,
      type: 'SELECT',
      question: 'Radiator(en) schuren',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 50,
      conditionalOn: {
        questionId: surfaces2Question.id,
        value: 'radiator-schuren',
      },
    },
  });

  for (let i = 0; i < countOptions.length; i++) {
    await prisma.stepOption.create({
      data: {
        questionId: radiatorQuestion.id,
        order: i,
        label: countOptions[i].label,
        value: countOptions[i].value,
      },
    });
  }

  // Question 5.5: Schuren witte vloer m² (€250 per m²)
  await prisma.question.create({
    data: {
      stepId: step5.id,
      order: 4,
      type: 'NUMBER',
      question: 'Schuren witte vloer',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 250,
      unit: 'm²',
      minValue: 1,
      placeholder: 'Aantal m²',
      conditionalOn: {
        questionId: surfaces2Question.id,
        value: 'schuren-witte-vloer',
      },
    },
  });

  console.log('Step 5 created: Other Surfaces (2/2)');

  // ==========================================
  // STEP 6: Plinten (Baseboards)
  // ==========================================
  const step6 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 5,
      description: 'Plinten',
    },
  });

  // Question 6.1: Need new baseboards?
  const plintenQuestion = await prisma.question.create({
    data: {
      stepId: step6.id,
      order: 0,
      type: 'SELECT',
      question: 'Nieuwe plinten nodig?',
      required: true,
      pricingImpact: 'NONE',
    },
  });

  await prisma.stepOption.create({
    data: {
      questionId: plintenQuestion.id,
      order: 0,
      label: 'Nee',
      value: 'nee',
    },
  });

  await prisma.stepOption.create({
    data: {
      questionId: plintenQuestion.id,
      order: 1,
      label: 'Ja, lage (€60 per 10 meter)',
      value: 'ja-lage',
    },
  });

  await prisma.stepOption.create({
    data: {
      questionId: plintenQuestion.id,
      order: 2,
      label: 'Ja, hoge (€120 per 10 meter)',
      value: 'ja-hoge',
    },
  });

  // Question 6.2: Meters for lage plinten (€6 per meter = €60 per 10m)
  await prisma.question.create({
    data: {
      stepId: step6.id,
      order: 1,
      type: 'NUMBER',
      question: 'Aantal meter (excl. plinten)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 6, // €60 per 10 meter = €6 per meter
      unit: 'meter',
      minValue: 1,
      placeholder: 'Aantal meter',
      conditionalOn: {
        questionId: plintenQuestion.id,
        value: 'ja-lage',
      },
    },
  });

  // Question 6.3: Meters for hoge plinten (€12 per meter = €120 per 10m)
  await prisma.question.create({
    data: {
      stepId: step6.id,
      order: 2,
      type: 'NUMBER',
      question: 'Aantal meter (excl. plinten)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 12, // €120 per 10 meter = €12 per meter
      unit: 'meter',
      minValue: 1,
      placeholder: 'Aantal meter',
      conditionalOn: {
        questionId: plintenQuestion.id,
        value: 'ja-hoge',
      },
    },
  });

  console.log('Step 6 created: Plinten');

  // ==========================================
  // Verify creation
  // ==========================================
  const createdProduct = await prisma.product.findUnique({
    where: { id: product.id },
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

  console.log('\n========================================');
  console.log('Parketrenovatie Calculator Created!');
  console.log('========================================');
  console.log(`Product: ${createdProduct?.name}`);
  console.log(`Slug: ${createdProduct?.slug}`);
  console.log(`Steps: ${createdProduct?.steps.length}`);

  createdProduct?.steps.forEach((step, i) => {
    console.log(`\nStep ${i + 1}: ${step.description}`);
    step.questions.forEach((q, j) => {
      console.log(`  Q${j + 1}: ${q.question} (${q.type}, ${q.pricingImpact})`);
      console.log(`       Options: ${q.options.length}`);
    });
  });

  console.log('\n========================================');
  console.log('The remaining steps (Planning, Contact, Final)');
  console.log('are handled by the frontend DynamicMultiStepForm');
  console.log('========================================');
}

createParketRenovatieCalculator()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
