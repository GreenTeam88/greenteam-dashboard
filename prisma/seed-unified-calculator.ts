import { PrismaClient, StepType, PricingImpact } from '@prisma/client';

const prisma = new PrismaClient();

// First, delete all existing calculators
async function deleteAllCalculators() {
  console.log('Deleting all existing calculators...');
  await prisma.product.deleteMany();
  console.log('All calculators deleted.');
}

// Create the unified calculator with category selection
async function createUnifiedCalculator() {
  console.log('\nCreating unified GreenTeam Calculator...');

  const floorOptions = [
    { order: 0, label: '0 (Begane grond)', value: '0' },
    { order: 1, label: '1', value: '1' },
    { order: 2, label: '2', value: '2' },
    { order: 3, label: '3', value: '3' },
    { order: 4, label: '4', value: '4' },
    { order: 5, label: '5', value: '5' },
    { order: 6, label: '6', value: '6' },
    { order: 7, label: '7', value: '7' },
    { order: 8, label: '8', value: '8' },
    { order: 9, label: '9', value: '9' },
    { order: 10, label: '10+', value: '10+' },
  ];

  const numberOptions = Array.from({ length: 10 }, (_, i) => ({
    order: i,
    label: i === 9 ? '10+' : String(i + 1),
    value: i === 9 ? '10+' : String(i + 1),
  }));

  // Create the product first
  const product = await prisma.product.create({
    data: {
      name: 'GreenTeam Calculator',
      slug: 'greenteam',
      description: 'Bereken direct de prijs voor al onze diensten',
      status: 'published',
    },
  });

  // ============================================
  // STEP 1: Category & Service Selection
  // ============================================
  const step1 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 0,
      description: 'Kies uw categorie en dienst',
    },
  });

  // Question 1.1: Category Selection
  const categoryQuestion = await prisma.question.create({
    data: {
      stepId: step1.id,
      order: 0,
      type: 'SELECT',
      question: 'Categorie',
      required: true,
      pricingImpact: 'NONE',
      options: {
        create: [
          { order: 0, label: 'Parketrenovatie', value: 'parketrenovatie' },
          { order: 1, label: 'Traprenovatie', value: 'traprenovatie' },
          { order: 2, label: 'Vloeren leggen', value: 'vloeren-leggen' },
          { order: 3, label: 'Stofferen', value: 'stofferen' },
          { order: 4, label: 'Overig', value: 'overig' },
        ],
      },
    },
  });

  // Question 1.2: Parketrenovatie Services
  const parketServiceQuestion = await prisma.question.create({
    data: {
      stepId: step1.id,
      order: 1,
      type: 'SELECT',
      question: 'Wat wilt u gedaan hebben?',
      required: true,
      pricingImpact: 'BASE',
      pricePerUnit: 1,
      unit: 'm²',
      conditionalOn: { questionId: categoryQuestion.id, value: 'parketrenovatie' },
      options: {
        create: [
          { order: 0, label: 'Schuren + polijsten (zonder behandeling) - €20/m²', value: 'schuren-polijsten', price: 20 },
          { order: 1, label: 'Schuren + polijsten + oliën naturel - €30/m²', value: 'olien-naturel', price: 30 },
          { order: 2, label: 'Schuren + polijsten + oliën in kleur - €35/m²', value: 'olien-kleur', price: 35 },
          { order: 3, label: 'Schuren + polijsten + hardwax naturel - €35/m²', value: 'hardwax-naturel', price: 35 },
          { order: 4, label: 'Schuren + polijsten + hardwax in kleur - €37,50/m²', value: 'hardwax-kleur', price: 37.5 },
          { order: 5, label: 'Schuren + polijsten + lakken naturel - €40/m²', value: 'lakken-naturel', price: 40 },
          { order: 6, label: 'Schuren + polijsten + lakken in kleur - €46,50/m²', value: 'lakken-kleur', price: 46.5 },
          { order: 7, label: 'Schuren + polijsten + lakken met Skylt - €42,50/m²', value: 'lakken-skylt', price: 42.5 },
          { order: 8, label: 'Schuren + polijsten + olie + lak - €47,50/m²', value: 'olie-lak', price: 47.5 },
          { order: 9, label: 'Schuren + polijsten + lak zwartmat - €65/m²', value: 'lak-zwartmat', price: 65 },
          { order: 10, label: 'Schuren + polijsten + lak wit mat - €65/m²', value: 'lak-witmat', price: 65 },
          { order: 11, label: 'Ben ik nog niet over uit', value: 'onbekend', price: 0 },
          { order: 12, label: 'Ik wil graag advies', value: 'advies', price: 0 },
        ],
      },
    },
  });

  // Question 1.3: Traprenovatie Services
  const trapServiceQuestion = await prisma.question.create({
    data: {
      stepId: step1.id,
      order: 2,
      type: 'SELECT',
      question: 'Wat wilt u gedaan hebben?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'traprenovatie' },
      options: {
        create: [
          { order: 0, label: 'Bekleden met PVC - Op aanvraag', value: 'pvc' },
          { order: 1, label: 'Bekleden met laminaat - Op aanvraag', value: 'laminaat' },
          { order: 2, label: 'Bekleden met hout - Op aanvraag', value: 'hout' },
          { order: 3, label: 'Bekleden met tapijt - Op aanvraag', value: 'tapijt' },
          { order: 4, label: 'Bekleden met traploper - Op aanvraag', value: 'traploper' },
          { order: 5, label: 'Bekleden met linoleum - Op aanvraag', value: 'linoleum' },
          { order: 6, label: 'Schuren en behandelen - Op aanvraag', value: 'behandelen' },
          { order: 7, label: 'Schuren en schilderen - Op aanvraag', value: 'schilderen' },
          { order: 8, label: 'Beton Ciré - Op aanvraag', value: 'betoncire' },
          { order: 9, label: 'Ben ik nog niet over uit', value: 'onbekend' },
          { order: 10, label: 'Ik wil graag advies', value: 'advies' },
        ],
      },
    },
  });

  // Question 1.4: Vloeren Leggen Services
  const vloerenServiceQuestion = await prisma.question.create({
    data: {
      stepId: step1.id,
      order: 3,
      type: 'SELECT',
      question: 'Wat wilt u gedaan hebben?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'vloeren-leggen' },
      options: {
        create: [
          { order: 0, label: 'Parket leggen - Op aanvraag', value: 'parket' },
          { order: 1, label: 'Laminaat leggen - Op aanvraag', value: 'laminaat' },
          { order: 2, label: 'PVC (klik) leggen - Op aanvraag', value: 'pvc-klik' },
          { order: 3, label: 'PVC (plak) leggen - Op aanvraag', value: 'pvc-plak' },
          { order: 4, label: 'Tapijt leggen - Op aanvraag', value: 'tapijt' },
          { order: 5, label: 'Linoleum leggen - Op aanvraag', value: 'linoleum' },
          { order: 6, label: 'Ben ik nog niet over uit', value: 'onbekend' },
          { order: 7, label: 'Ik wil graag advies', value: 'advies' },
        ],
      },
    },
  });

  // Question 1.5: Stofferen Services
  const stofferenServiceQuestion = await prisma.question.create({
    data: {
      stepId: step1.id,
      order: 4,
      type: 'SELECT',
      question: 'Wat wilt u gedaan hebben?',
      required: true,
      pricingImpact: 'BASE',
      pricePerUnit: 1,
      unit: 'm²',
      conditionalOn: { questionId: categoryQuestion.id, value: 'stofferen' },
      options: {
        create: [
          { order: 0, label: 'Vloer - €40/m²', value: 'vloer', price: 40 },
          { order: 1, label: 'Tapijttegels - €30/m²', value: 'tapijttegels', price: 30 },
          { order: 2, label: 'Deurmat - Op aanvraag', value: 'deurmat', price: 0 },
          { order: 3, label: 'Droogloopmat - Op aanvraag', value: 'droogloopmat', price: 0 },
          { order: 4, label: 'Rode loper - Op aanvraag', value: 'rode-loper', price: 0 },
          { order: 5, label: 'Bedrijfshal - Op aanvraag', value: 'bedrijfshal', price: 0 },
          { order: 6, label: 'Ben ik nog niet over uit', value: 'onbekend', price: 0 },
          { order: 7, label: 'Ik wil graag advies', value: 'advies', price: 0 },
        ],
      },
    },
  });

  // Question 1.6: Overig Services
  const overigServiceQuestion = await prisma.question.create({
    data: {
      stepId: step1.id,
      order: 5,
      type: 'SELECT',
      question: 'Wat wilt u gedaan hebben?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'overig' },
      options: {
        create: [
          { order: 0, label: 'Vloerverwarming - Op aanvraag', value: 'vloerverwarming' },
          { order: 1, label: 'Egaliseren - Op aanvraag', value: 'egaliseren' },
          { order: 2, label: 'Gietvloeren - Op aanvraag', value: 'gietvloeren' },
          { order: 3, label: 'Tegelen - Op aanvraag', value: 'tegelen' },
          { order: 4, label: 'Vloer verwijderen - Op aanvraag', value: 'vloer-verwijderen' },
          { order: 5, label: 'Natuursteen behandelen - Op aanvraag', value: 'natuursteen' },
          { order: 6, label: 'Opslag - Op aanvraag', value: 'opslag' },
        ],
      },
    },
  });

  // ============================================
  // STEP 2: Floor & Area (for Parketrenovatie, Stofferen)
  // ============================================
  const step2 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 1,
      description: 'Een aantal vragen over de ruimte(s)',
    },
  });

  // Question 2.1: Floor selection (Parketrenovatie)
  const parketFloorQuestion = await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 0,
      type: 'CHECKBOX',
      question: 'Welke verdieping(en)?',
      required: true,
      pricingImpact: 'COUNT_SELECTED',
      pricePerUnit: 25,
      countThreshold: 0,
      conditionalOn: { questionId: categoryQuestion.id, value: 'parketrenovatie' },
      options: {
        create: floorOptions,
      },
    },
  });

  // Question 2.2: Area (Parketrenovatie)
  const parketAreaQuestion = await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 1,
      type: 'NUMBER',
      question: 'Aantal m²',
      required: true,
      pricingImpact: 'MULTIPLIER',
      unit: 'm²',
      minValue: 1,
      placeholder: 'Voer het aantal m² in',
      conditionalOn: { questionId: categoryQuestion.id, value: 'parketrenovatie' },
    },
  });

  // Question 2.3: Floor selection (Stofferen)
  const stofferenFloorQuestion = await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 2,
      type: 'CHECKBOX',
      question: 'Welke verdieping(en)?',
      required: true,
      pricingImpact: 'COUNT_SELECTED',
      pricePerUnit: 25,
      countThreshold: 0,
      conditionalOn: { questionId: categoryQuestion.id, value: 'stofferen' },
      options: {
        create: floorOptions.map((opt, i) => ({ ...opt, order: i })),
      },
    },
  });

  // Question 2.4: Area (Stofferen)
  const stofferenAreaQuestion = await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 3,
      type: 'NUMBER',
      question: 'Aantal m²',
      required: true,
      pricingImpact: 'MULTIPLIER',
      unit: 'm²',
      minValue: 1,
      placeholder: 'Voer het aantal m² in',
      conditionalOn: { questionId: categoryQuestion.id, value: 'stofferen' },
    },
  });

  // Question 2.5: Floor selection (Vloeren leggen)
  await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 4,
      type: 'CHECKBOX',
      question: 'Welke verdieping(en)?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'vloeren-leggen' },
      options: {
        create: floorOptions.map((opt, i) => ({ ...opt, order: i })),
      },
    },
  });

  // Question 2.6: Area (Vloeren leggen)
  await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 5,
      type: 'NUMBER',
      question: 'Aantal m²',
      required: true,
      pricingImpact: 'NONE',
      unit: 'm²',
      minValue: 1,
      placeholder: 'Voer het aantal m² in',
      conditionalOn: { questionId: categoryQuestion.id, value: 'vloeren-leggen' },
    },
  });

  // Question 2.7: Floor selection (Overig)
  await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 6,
      type: 'CHECKBOX',
      question: 'Welke verdieping(en)?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'overig' },
      options: {
        create: floorOptions.map((opt, i) => ({ ...opt, order: i })),
      },
    },
  });

  // Question 2.8: Area (Overig)
  await prisma.question.create({
    data: {
      stepId: step2.id,
      order: 7,
      type: 'NUMBER',
      question: 'Aantal m²',
      required: true,
      pricingImpact: 'NONE',
      unit: 'm²',
      minValue: 1,
      placeholder: 'Voer het aantal m² in',
      conditionalOn: { questionId: categoryQuestion.id, value: 'overig' },
    },
  });

  // ============================================
  // STEP 3: Traprenovatie specific questions
  // ============================================
  const step3 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 2,
      description: 'Informatie over de trap(pen)',
    },
  });

  // Question 3.1: Open stairs count (Traprenovatie)
  const openStairsQuestion = await prisma.question.create({
    data: {
      stepId: step3.id,
      order: 0,
      type: 'SELECT',
      question: 'Aantal open trap(pen)',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'traprenovatie' },
      options: {
        create: [
          { order: 0, label: '0 (geen open trappen)', value: '0' },
          ...Array.from({ length: 15 }, (_, i) => ({
            order: i + 1,
            label: i === 14 ? '15+' : String(i + 1),
            value: i === 14 ? '15+' : String(i + 1),
          })),
        ],
      },
    },
  });

  // Question 3.2: Open stairs steps count
  await prisma.question.create({
    data: {
      stepId: step3.id,
      order: 1,
      type: 'SELECT',
      question: 'Aantal totale treden in de open trap(pen)',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: {
        operator: 'OR',
        conditions: [
          ...Array.from({ length: 14 }, (_, i) => ({
            questionId: openStairsQuestion.id,
            value: String(i + 1),
          })),
          { questionId: openStairsQuestion.id, value: '15+' },
        ],
      },
      options: {
        create: Array.from({ length: 30 }, (_, i) => ({
          order: i,
          label: i === 29 ? '30+' : String(i + 1),
          value: i === 29 ? '30+' : String(i + 1),
        })),
      },
    },
  });

  // Question 3.3: Closed stairs count
  const closedStairsQuestion = await prisma.question.create({
    data: {
      stepId: step3.id,
      order: 2,
      type: 'SELECT',
      question: 'Aantal dichte trap(pen)',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'traprenovatie' },
      options: {
        create: [
          { order: 0, label: '0 (geen dichte trappen)', value: '0' },
          ...Array.from({ length: 15 }, (_, i) => ({
            order: i + 1,
            label: i === 14 ? '15+' : String(i + 1),
            value: i === 14 ? '15+' : String(i + 1),
          })),
        ],
      },
    },
  });

  // Question 3.4: Closed stairs steps count
  await prisma.question.create({
    data: {
      stepId: step3.id,
      order: 3,
      type: 'SELECT',
      question: 'Aantal totale treden in de dichte trap(pen)',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: {
        operator: 'OR',
        conditions: [
          ...Array.from({ length: 14 }, (_, i) => ({
            questionId: closedStairsQuestion.id,
            value: String(i + 1),
          })),
          { questionId: closedStairsQuestion.id, value: '15+' },
        ],
      },
      options: {
        create: Array.from({ length: 30 }, (_, i) => ({
          order: i,
          label: i === 29 ? '30+' : String(i + 1),
          value: i === 29 ? '30+' : String(i + 1),
        })),
      },
    },
  });

  // ============================================
  // STEP 4: Additional questions (Parket damage, etc.)
  // ============================================
  const step4 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 3,
      description: 'Aanvullende vragen',
    },
  });

  // Question 4.1: Damage repairs (Parketrenovatie)
  const damageQuestion = await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 0,
      type: 'SELECT',
      question: 'Zijn er beschadigingen of reparaties nodig?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'parketrenovatie' },
      options: {
        create: [
          { order: 0, label: 'Ja (Let op: Berekening volgt na aanvraag)', value: 'Ja' },
          { order: 1, label: 'Nee', value: 'Nee' },
        ],
      },
    },
  });

  // Question 4.2: Number of repairs
  await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 1,
      type: 'SELECT',
      question: 'Aantal beschadigingen of reparaties',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: damageQuestion.id, value: 'Ja' },
      options: {
        create: numberOptions,
      },
    },
  });

  // Question 4.3: Additional surfaces (Parketrenovatie)
  const surfacesQuestion = await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 2,
      type: 'CHECKBOX',
      question: 'Zijn er nog andere oppervlaktes?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'parketrenovatie' },
      options: {
        create: [
          { order: 0, label: 'Nee', value: 'Nee', isExclusive: true },
          { order: 1, label: 'Traptredes - €50/stuk', value: 'Traptredes', price: 50 },
          { order: 2, label: 'Opstapjes - €50/stuk', value: 'Opstapjes', price: 50 },
          { order: 3, label: 'Drempels - €25/stuk', value: 'Drempels', price: 25 },
          { order: 4, label: 'Dorpels - €25/stuk', value: 'Dorpels', price: 25 },
          { order: 5, label: 'Vensterbanken - €45/meter', value: 'Vensterbanken', price: 45 },
          { order: 6, label: 'Planken/Plateaus - €50/meter', value: 'Planken', price: 50 },
          { order: 7, label: 'Salontafels/Eettafels - €50/m²', value: 'Tafels', price: 50 },
        ],
      },
    },
  });

  // Question 4.4: Count of traptredes/opstapjes
  await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 3,
      type: 'SELECT',
      question: 'Aantal traptrede(s)/opstapje(s)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 50,
      conditionalOn: {
        operator: 'OR',
        conditions: [
          { questionId: surfacesQuestion.id, value: 'Traptredes' },
          { questionId: surfacesQuestion.id, value: 'Opstapjes' },
        ],
      },
      options: {
        create: numberOptions,
      },
    },
  });

  // Question 4.5: Count of drempels/dorpels
  await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 4,
      type: 'SELECT',
      question: 'Aantal drempel(s)/dorpel(s)',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 25,
      conditionalOn: {
        operator: 'OR',
        conditions: [
          { questionId: surfacesQuestion.id, value: 'Drempels' },
          { questionId: surfacesQuestion.id, value: 'Dorpels' },
        ],
      },
      options: {
        create: numberOptions,
      },
    },
  });

  // Question 4.6: Stair options (Traprenovatie)
  await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 5,
      type: 'SELECT',
      question: 'Stootborden mee bekleden?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: { questionId: categoryQuestion.id, value: 'traprenovatie' },
      options: {
        create: [
          { order: 0, label: 'Ja', value: 'Ja' },
          { order: 1, label: 'Nee', value: 'Nee' },
        ],
      },
    },
  });

  // Question 4.7: Current substrate (Stofferen/Vloeren)
  await prisma.question.create({
    data: {
      stepId: step4.id,
      order: 6,
      type: 'SELECT',
      question: 'Wat is de huidige ondergrond?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: {
        operator: 'OR',
        conditions: [
          { questionId: categoryQuestion.id, value: 'stofferen' },
          { questionId: categoryQuestion.id, value: 'vloeren-leggen' },
        ],
      },
      options: {
        create: [
          { order: 0, label: 'Beton', value: 'Beton' },
          { order: 1, label: 'Hout', value: 'Hout' },
          { order: 2, label: 'Laminaat', value: 'Laminaat' },
          { order: 3, label: 'PVC', value: 'PVC' },
          { order: 4, label: 'Grind', value: 'Grind' },
          { order: 5, label: 'Tegels', value: 'Tegels' },
          { order: 6, label: 'Lijmresten', value: 'Lijmresten' },
          { order: 7, label: 'Tapijt', value: 'Tapijt' },
          { order: 8, label: 'Overig', value: 'Overig' },
        ],
      },
    },
  });

  // ============================================
  // STEP 5: Baseboards
  // ============================================
  const step5 = await prisma.formStep.create({
    data: {
      productId: product.id,
      order: 4,
      description: 'Plinten',
    },
  });

  // Question 5.1: Baseboards needed
  const baseboardQuestion = await prisma.question.create({
    data: {
      stepId: step5.id,
      order: 0,
      type: 'SELECT',
      question: 'Nieuwe plinten nodig?',
      required: true,
      pricingImpact: 'NONE',
      conditionalOn: {
        operator: 'OR',
        conditions: [
          { questionId: categoryQuestion.id, value: 'parketrenovatie' },
          { questionId: categoryQuestion.id, value: 'stofferen' },
          { questionId: categoryQuestion.id, value: 'vloeren-leggen' },
        ],
      },
      options: {
        create: [
          { order: 0, label: 'Ja, lage - €6/meter', value: 'lage', price: 6 },
          { order: 1, label: 'Ja, hoge - €12/meter', value: 'hoge', price: 12 },
          { order: 2, label: 'Nee', value: 'Nee' },
        ],
      },
    },
  });

  // Question 5.2: Meters of baseboards
  await prisma.question.create({
    data: {
      stepId: step5.id,
      order: 1,
      type: 'NUMBER',
      question: 'Aantal meter plinten',
      required: true,
      pricingImpact: 'ADDITIVE',
      pricePerUnit: 6,
      unit: 'meter',
      placeholder: 'Voer het aantal meter in',
      conditionalOn: {
        operator: 'OR',
        conditions: [
          { questionId: baseboardQuestion.id, value: 'lage' },
          { questionId: baseboardQuestion.id, value: 'hoge' },
        ],
      },
    },
  });

  console.log('Unified calculator created successfully!');
  console.log(`  ID: ${product.id}`);
  console.log(`  Slug: ${product.slug}`);
  console.log('  Steps: 5');
}

async function main() {
  try {
    await deleteAllCalculators();
    await createUnifiedCalculator();
    console.log('\n=== Done! ===');
    console.log('\nThe unified calculator is available at:');
    console.log('  Frontend: /calculator/greenteam');
    console.log('  Dashboard: /dashboard/calculators');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
