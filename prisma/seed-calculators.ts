import { PrismaClient, StepType, PricingImpact } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to create a calculator with all its steps
async function createCalculator(data: {
  name: string;
  slug: string;
  description: string;
  status: string;
  steps: Array<{
    order: number;
    description: string | null;
    questions: Array<{
      order: number;
      type: StepType;
      question: string;
      required: boolean;
      pricingImpact: PricingImpact;
      pricePerUnit?: number | null;
      unit?: string | null;
      minValue?: number | null;
      maxValue?: number | null;
      placeholder?: string | null;
      countThreshold?: number | null;
      conditionalOn?: any;
      options: Array<{
        order: number;
        label: string;
        value: string;
        price?: number | null;
        imageUrl?: string | null;
        isExclusive?: boolean;
      }>;
    }>;
  }>;
}) {
  // Check if calculator already exists
  const existing = await prisma.product.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    console.log(`Calculator "${data.name}" already exists, skipping...`);
    return existing;
  }

  // Create the product with nested steps, questions, and options
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      status: data.status,
      steps: {
        create: data.steps.map((step) => ({
          order: step.order,
          description: step.description,
          questions: {
            create: step.questions.map((q) => ({
              order: q.order,
              type: q.type,
              question: q.question,
              required: q.required,
              pricingImpact: q.pricingImpact,
              pricePerUnit: q.pricePerUnit ?? null,
              unit: q.unit ?? null,
              minValue: q.minValue ?? null,
              maxValue: q.maxValue ?? null,
              placeholder: q.placeholder ?? null,
              countThreshold: q.countThreshold ?? null,
              conditionalOn: q.conditionalOn ?? null,
              options: {
                create: q.options.map((opt) => ({
                  order: opt.order,
                  label: opt.label,
                  value: opt.value,
                  price: opt.price ?? null,
                  imageUrl: opt.imageUrl ?? null,
                  isExclusive: opt.isExclusive ?? false,
                })),
              },
            })),
          },
        })),
      },
    },
  });

  console.log(`Created calculator: ${data.name}`);
  return product;
}

// ============================================
// PARKETRENOVATIE CALCULATOR
// ============================================
async function seedParketrenovatie() {
  const floorOptions = [
    { order: 0, label: '0 (Begane grond)', value: '0 (Begane grond)' },
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

  const yesNoOptions = [
    { order: 0, label: 'Ja (Let op: Berekening volgt na aanvraag)', value: 'Ja' },
    { order: 1, label: 'Nee', value: 'Nee' },
  ];

  const numberOptions = Array.from({ length: 10 }, (_, i) => ({
    order: i,
    label: i === 9 ? '10+' : String(i + 1),
    value: i === 9 ? '10+' : String(i + 1),
  }));

  await createCalculator({
    name: 'Parketrenovatie',
    slug: 'parketrenovatie',
    description: 'Parket schuren, polijsten en behandelen',
    status: 'published',
    steps: [
      // Step 1: Service Selection
      {
        order: 0,
        description: 'Kies uw gewenste dienst',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Wat wilt u gedaan hebben?',
            required: true,
            pricingImpact: 'BASE',
            pricePerUnit: 1,
            unit: 'm²',
            options: [
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
        ],
      },
      // Step 2: Floor and Area
      {
        order: 1,
        description: 'Een aantal vragen over de ruimte(s)',
        questions: [
          {
            order: 0,
            type: 'CHECKBOX',
            question: 'Welke verdieping(en)?',
            required: true,
            pricingImpact: 'COUNT_SELECTED',
            pricePerUnit: 25,
            countThreshold: 0,
            options: floorOptions,
          },
          {
            order: 1,
            type: 'NUMBER',
            question: 'Aantal m²',
            required: true,
            pricingImpact: 'MULTIPLIER',
            unit: 'm²',
            minValue: 1,
            placeholder: 'Voer het aantal m² in',
            options: [],
          },
        ],
      },
      // Step 3 Part 1: Damage Assessment
      {
        order: 2,
        description: 'Beschadigingen en reparaties',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Zijn er beschadigingen of reparaties nodig?',
            required: true,
            pricingImpact: 'NONE',
            options: yesNoOptions,
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Aantal beschadigingen of reparaties',
            required: true,
            pricingImpact: 'NONE',
            conditionalOn: { questionId: 'PLACEHOLDER_DAMAGE', value: 'Ja' },
            options: numberOptions,
          },
        ],
      },
      // Step 3 Part 2: Additional Surfaces 1
      {
        order: 3,
        description: 'Andere oppervlaktes (1/2)',
        questions: [
          {
            order: 0,
            type: 'CHECKBOX',
            question: 'Zijn er nog andere oppervlaktes? (1/2)',
            required: true,
            pricingImpact: 'NONE',
            options: [
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
          {
            order: 1,
            type: 'SELECT',
            question: 'Aantal traptrede(s)/opstapje(s)',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 50,
            conditionalOn: {
              operator: 'OR',
              conditions: [
                { questionId: 'PLACEHOLDER_SURFACES1', value: 'Traptredes' },
                { questionId: 'PLACEHOLDER_SURFACES1', value: 'Opstapjes' },
              ],
            },
            options: numberOptions,
          },
          {
            order: 2,
            type: 'SELECT',
            question: 'Aantal drempel(s)/dorpel(s)',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 25,
            conditionalOn: {
              operator: 'OR',
              conditions: [
                { questionId: 'PLACEHOLDER_SURFACES1', value: 'Drempels' },
                { questionId: 'PLACEHOLDER_SURFACES1', value: 'Dorpels' },
              ],
            },
            options: numberOptions,
          },
          {
            order: 3,
            type: 'NUMBER',
            question: 'Vensterbank(en) - aantal meter(s)',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 45,
            unit: 'meter',
            conditionalOn: { questionId: 'PLACEHOLDER_SURFACES1', value: 'Vensterbanken' },
            options: [],
          },
          {
            order: 4,
            type: 'NUMBER',
            question: 'Plank(en)/Plateau(s) - aantal meter(s)',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 50,
            unit: 'meter',
            conditionalOn: { questionId: 'PLACEHOLDER_SURFACES1', value: 'Planken' },
            options: [],
          },
          {
            order: 5,
            type: 'NUMBER',
            question: 'Salontafel(s)/Eettafel(s) - aantal m²',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 50,
            unit: 'm²',
            conditionalOn: { questionId: 'PLACEHOLDER_SURFACES1', value: 'Tafels' },
            options: [],
          },
        ],
      },
      // Step 3 Part 3: Additional Surfaces 2
      {
        order: 4,
        description: 'Andere oppervlaktes (2/2)',
        questions: [
          {
            order: 0,
            type: 'CHECKBOX',
            question: 'Zijn er nog andere oppervlaktes? (2/2)',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Nee', value: 'Nee', isExclusive: true },
              { order: 1, label: 'Bovenkant convectorput schuren - €50/stuk', value: 'Convector-boven', price: 50 },
              { order: 2, label: 'Achter convectorput schuren - €50/stuk', value: 'Convector-achter', price: 50 },
              { order: 3, label: 'Onderkant en achter radiator schuren - €50/stuk', value: 'Radiator', price: 50 },
              { order: 4, label: 'Schuren witte vloer (tijd + materiaal) - €250/m²', value: 'Witte-vloer', price: 250 },
            ],
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Aantal keer convectorput schuren (bovenkant)',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 50,
            conditionalOn: { questionId: 'PLACEHOLDER_SURFACES2', value: 'Convector-boven' },
            options: numberOptions,
          },
          {
            order: 2,
            type: 'SELECT',
            question: 'Aantal keer convectorput schuren (achter)',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 50,
            conditionalOn: { questionId: 'PLACEHOLDER_SURFACES2', value: 'Convector-achter' },
            options: numberOptions,
          },
          {
            order: 3,
            type: 'SELECT',
            question: 'Aantal keer radiator schuren',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 50,
            conditionalOn: { questionId: 'PLACEHOLDER_SURFACES2', value: 'Radiator' },
            options: numberOptions,
          },
          {
            order: 4,
            type: 'NUMBER',
            question: 'Witte vloer - oppervlakte in m²',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 250,
            unit: 'm²',
            conditionalOn: { questionId: 'PLACEHOLDER_SURFACES2', value: 'Witte-vloer' },
            options: [],
          },
        ],
      },
      // Step 4: Baseboards
      {
        order: 5,
        description: 'Plinten',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Nieuwe plinten nodig?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Ja, lage - €6/meter', value: 'lage', price: 6 },
              { order: 1, label: 'Ja, hoge - €12/meter', value: 'hoge', price: 12 },
              { order: 2, label: 'Nee', value: 'Nee' },
            ],
          },
          {
            order: 1,
            type: 'NUMBER',
            question: 'Aantal meter plinten',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 6, // Will be overridden by selection
            unit: 'meter',
            conditionalOn: {
              operator: 'OR',
              conditions: [
                { questionId: 'PLACEHOLDER_PLINTEN', value: 'lage' },
                { questionId: 'PLACEHOLDER_PLINTEN', value: 'hoge' },
              ],
            },
            options: [],
          },
        ],
      },
    ],
  });
}

// ============================================
// VLOEREN LEGGEN CALCULATOR
// ============================================
async function seedVloerenLeggen() {
  const floorOptions = [
    { order: 0, label: '0 (Begane grond)', value: '0 (Begane grond)' },
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

  const substrateOptions = [
    { order: 0, label: 'Beton', value: 'Beton' },
    { order: 1, label: 'Hout', value: 'Hout' },
    { order: 2, label: 'Laminaat', value: 'Laminaat' },
    { order: 3, label: 'PVC', value: 'PVC' },
    { order: 4, label: 'Grind', value: 'Grind' },
    { order: 5, label: 'Tegels', value: 'Tegels' },
    { order: 6, label: 'Lijmresten', value: 'Lijmresten' },
    { order: 7, label: 'Tapijt', value: 'Tapijt' },
    { order: 8, label: 'Overig', value: 'Overig' },
  ];

  await createCalculator({
    name: 'Vloeren Leggen',
    slug: 'vloeren-leggen',
    description: 'Parket, laminaat, PVC, tapijt en linoleum leggen',
    status: 'published',
    steps: [
      // Step 1: Floor Type Selection
      {
        order: 0,
        description: 'Kies uw vloertype',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Welk type vloer wilt u laten leggen?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Parket', value: 'Parket' },
              { order: 1, label: 'Laminaat', value: 'Laminaat' },
              { order: 2, label: 'PVC (klik)', value: 'PVC-klik' },
              { order: 3, label: 'PVC (plak)', value: 'PVC-plak' },
              { order: 4, label: 'Tapijt', value: 'Tapijt' },
              { order: 5, label: 'Linoleum', value: 'Linoleum' },
            ],
          },
        ],
      },
      // Step 2: Sub-service selection (Parket)
      {
        order: 1,
        description: 'Kies de legmethode',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Wat voor soort parket?',
            required: true,
            pricingImpact: 'BASE',
            pricePerUnit: 1,
            unit: 'm²',
            conditionalOn: { questionId: 'PLACEHOLDER_FLOORTYPE', value: 'Parket' },
            options: [
              { order: 0, label: 'Rechte plank zwevend - €25/m²', value: 'parket-zwevend', price: 25 },
              { order: 1, label: 'Rechte plank verlijmd - €30/m²', value: 'parket-verlijmd', price: 30 },
              { order: 2, label: 'Tapis verlijmd + verspijkerd - €45/m²', value: 'parket-tapis', price: 45 },
              { order: 3, label: 'Visgraat zwevend - €40/m²', value: 'parket-visgraat-zwevend', price: 40 },
              { order: 4, label: 'Visgraat verlijmd - €45/m²', value: 'parket-visgraat-verlijmd', price: 45 },
              { order: 5, label: 'Hongaarse punt verlijmd - €45/m²', value: 'parket-hongaars', price: 45 },
              { order: 6, label: 'Mozaïek - €60/m²', value: 'parket-mozaiek', price: 60 },
              { order: 7, label: 'Hexagon / 3D / Patronen - €75/m²', value: 'parket-hexagon', price: 75 },
            ],
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Wat voor soort laminaat?',
            required: true,
            pricingImpact: 'BASE',
            pricePerUnit: 1,
            unit: 'm²',
            conditionalOn: { questionId: 'PLACEHOLDER_FLOORTYPE', value: 'Laminaat' },
            options: [
              { order: 0, label: 'Rechte plank - €15/m²', value: 'laminaat-recht', price: 15 },
              { order: 1, label: 'Tegel - €15/m²', value: 'laminaat-tegel', price: 15 },
              { order: 2, label: 'Visgraat - €25/m²', value: 'laminaat-visgraat', price: 25 },
              { order: 3, label: 'Hongaarse punt - €25/m²', value: 'laminaat-hongaars', price: 25 },
            ],
          },
          {
            order: 2,
            type: 'SELECT',
            question: 'Wat voor soort PVC (klik)?',
            required: true,
            pricingImpact: 'BASE',
            pricePerUnit: 1,
            unit: 'm²',
            conditionalOn: { questionId: 'PLACEHOLDER_FLOORTYPE', value: 'PVC-klik' },
            options: [
              { order: 0, label: 'Rechte plank - €17,50/m²', value: 'pvc-klik-recht', price: 17.5 },
              { order: 1, label: 'Tegel - €17,50/m²', value: 'pvc-klik-tegel', price: 17.5 },
              { order: 2, label: 'Visgraat - €25/m²', value: 'pvc-klik-visgraat', price: 25 },
              { order: 3, label: 'Hongaarse punt - €25/m²', value: 'pvc-klik-hongaars', price: 25 },
              { order: 4, label: 'Speciale patronen - €40/m²', value: 'pvc-klik-speciaal', price: 40 },
            ],
          },
          {
            order: 3,
            type: 'SELECT',
            question: 'Wat voor soort PVC (plak)?',
            required: true,
            pricingImpact: 'BASE',
            pricePerUnit: 1,
            unit: 'm²',
            conditionalOn: { questionId: 'PLACEHOLDER_FLOORTYPE', value: 'PVC-plak' },
            options: [
              { order: 0, label: 'Rechte plank - €15/m²', value: 'pvc-plak-recht', price: 15 },
              { order: 1, label: 'Tegel - €15/m²', value: 'pvc-plak-tegel', price: 15 },
              { order: 2, label: 'Visgraat - €20/m²', value: 'pvc-plak-visgraat', price: 20 },
              { order: 3, label: 'Hongaarse punt - €20/m²', value: 'pvc-plak-hongaars', price: 20 },
              { order: 4, label: 'Speciale patronen - €40/m²', value: 'pvc-plak-speciaal', price: 40 },
            ],
          },
          {
            order: 4,
            type: 'SELECT',
            question: 'Wat voor soort tapijt?',
            required: true,
            pricingImpact: 'BASE',
            pricePerUnit: 1,
            unit: 'm²',
            conditionalOn: { questionId: 'PLACEHOLDER_FLOORTYPE', value: 'Tapijt' },
            options: [
              { order: 0, label: 'Stroken - €30/m²', value: 'tapijt-stroken', price: 30 },
              { order: 1, label: 'Tegel - €20/m²', value: 'tapijt-tegel', price: 20 },
              { order: 2, label: 'Patronen - €25/m²', value: 'tapijt-patronen', price: 25 },
            ],
          },
          {
            order: 5,
            type: 'SELECT',
            question: 'Wat voor soort linoleum?',
            required: true,
            pricingImpact: 'BASE',
            pricePerUnit: 1,
            unit: 'm²',
            conditionalOn: { questionId: 'PLACEHOLDER_FLOORTYPE', value: 'Linoleum' },
            options: [
              { order: 0, label: 'Stroken - €25/m²', value: 'linoleum-stroken', price: 25 },
              { order: 1, label: 'Tegel - €15/m²', value: 'linoleum-tegel', price: 15 },
              { order: 2, label: 'Patronen - €25/m²', value: 'linoleum-patronen', price: 25 },
            ],
          },
        ],
      },
      // Step 3: Floor and substrate
      {
        order: 2,
        description: 'Ruimte informatie',
        questions: [
          {
            order: 0,
            type: 'CHECKBOX',
            question: 'Welke verdieping(en)?',
            required: true,
            pricingImpact: 'COUNT_SELECTED',
            pricePerUnit: 25,
            countThreshold: 0,
            options: floorOptions,
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Wat is de huidige ondergrond?',
            required: true,
            pricingImpact: 'NONE',
            options: substrateOptions,
          },
        ],
      },
      // Step 4: Area
      {
        order: 3,
        description: 'Oppervlakte',
        questions: [
          {
            order: 0,
            type: 'NUMBER',
            question: 'Aantal m²',
            required: true,
            pricingImpact: 'MULTIPLIER',
            unit: 'm²',
            minValue: 1,
            placeholder: 'Voer het aantal m² in',
            options: [],
          },
        ],
      },
      // Step 5: Baseboards
      {
        order: 4,
        description: 'Plinten',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Nieuwe plinten nodig?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Ja, lage - €6/meter', value: 'lage', price: 6 },
              { order: 1, label: 'Ja, hoge - €12/meter', value: 'hoge', price: 12 },
              { order: 2, label: 'Nee', value: 'Nee' },
            ],
          },
          {
            order: 1,
            type: 'NUMBER',
            question: 'Aantal meter plinten',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 6,
            unit: 'meter',
            conditionalOn: {
              operator: 'OR',
              conditions: [
                { questionId: 'PLACEHOLDER_PLINTEN', value: 'lage' },
                { questionId: 'PLACEHOLDER_PLINTEN', value: 'hoge' },
              ],
            },
            options: [],
          },
        ],
      },
    ],
  });
}

// ============================================
// STOFFEREN CALCULATOR
// ============================================
async function seedStofferen() {
  const floorOptions = [
    { order: 0, label: '0 (Begane grond)', value: '0 (Begane grond)' },
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

  await createCalculator({
    name: 'Stofferen',
    slug: 'stofferen',
    description: 'Vloeren stofferen en tapijt leggen',
    status: 'published',
    steps: [
      // Step 1: Service Selection
      {
        order: 0,
        description: 'Kies uw dienst',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Wat wilt u gedaan hebben?',
            required: true,
            pricingImpact: 'BASE',
            pricePerUnit: 1,
            unit: 'm²',
            options: [
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
        ],
      },
      // Step 2: Floor and Area
      {
        order: 1,
        description: 'Ruimte informatie',
        questions: [
          {
            order: 0,
            type: 'CHECKBOX',
            question: 'Welke verdieping(en)?',
            required: true,
            pricingImpact: 'COUNT_SELECTED',
            pricePerUnit: 25,
            countThreshold: 0,
            options: floorOptions,
          },
          {
            order: 1,
            type: 'NUMBER',
            question: 'Aantal m²',
            required: true,
            pricingImpact: 'MULTIPLIER',
            unit: 'm²',
            minValue: 1,
            placeholder: 'Voer het aantal m² in',
            options: [],
          },
        ],
      },
      // Step 3: Current Surface & Additional
      {
        order: 2,
        description: 'Ondergrond en extra oppervlaktes',
        questions: [
          {
            order: 0,
            type: 'CHECKBOX',
            question: 'Wat is de huidige ondergrond?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Beton', value: 'Beton' },
              { order: 1, label: 'Geëgaliseerd', value: 'Geegaliseerd' },
              { order: 2, label: 'Grind', value: 'Grind' },
              { order: 3, label: 'Hout', value: 'Hout' },
              { order: 4, label: 'Lijmresten', value: 'Lijmresten' },
              { order: 5, label: 'Laminaat', value: 'Laminaat' },
              { order: 6, label: 'Parket', value: 'Parket' },
              { order: 7, label: 'PVC', value: 'PVC' },
              { order: 8, label: 'Tapijt', value: 'Tapijt' },
              { order: 9, label: 'Tegels', value: 'Tegels' },
              { order: 10, label: 'Overig', value: 'Overig' },
            ],
          },
          {
            order: 1,
            type: 'CHECKBOX',
            question: 'Zijn er nog andere oppervlaktes?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Nee, geen andere oppervlakte(s)', value: 'Nee', isExclusive: true },
              { order: 1, label: 'Traptredes', value: 'Traptredes' },
              { order: 2, label: 'Entrée', value: 'Entree' },
              { order: 3, label: 'Opstapjes', value: 'Opstapjes' },
              { order: 4, label: 'Overloop', value: 'Overloop' },
            ],
          },
        ],
      },
      // Step 4: Baseboards
      {
        order: 3,
        description: 'Plinten',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Nieuwe plinten nodig?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Ja, lage - €6/meter', value: 'lage', price: 6 },
              { order: 1, label: 'Ja, hoge - €12/meter', value: 'hoge', price: 12 },
              { order: 2, label: 'Nee', value: 'Nee' },
            ],
          },
          {
            order: 1,
            type: 'NUMBER',
            question: 'Aantal meter plinten',
            required: true,
            pricingImpact: 'ADDITIVE',
            pricePerUnit: 6,
            unit: 'meter',
            conditionalOn: {
              operator: 'OR',
              conditions: [
                { questionId: 'PLACEHOLDER_PLINTEN', value: 'lage' },
                { questionId: 'PLACEHOLDER_PLINTEN', value: 'hoge' },
              ],
            },
            options: [],
          },
        ],
      },
    ],
  });
}

// ============================================
// OVERIG CALCULATOR
// ============================================
async function seedOverig() {
  const floorOptions = [
    { order: 0, label: '0 (Begane grond)', value: '0 (Begane grond)' },
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

  const yesNoOptions = [
    { order: 0, label: 'Ja (Let op: Berekening volgt na aanvraag)', value: 'Ja' },
    { order: 1, label: 'Nee', value: 'Nee' },
  ];

  await createCalculator({
    name: 'Overig',
    slug: 'overig',
    description: 'Overige vloer diensten - op aanvraag',
    status: 'published',
    steps: [
      // Step 1: Service Selection
      {
        order: 0,
        description: 'Kies uw dienst',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Wat wilt u gedaan hebben?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Vloerverwarming - Op aanvraag', value: 'vloerverwarming' },
              { order: 1, label: 'Egaliseren - Op aanvraag', value: 'egaliseren' },
              { order: 2, label: 'Gietvloeren - Op aanvraag', value: 'gietvloeren' },
              { order: 3, label: 'Tegelen - Op aanvraag', value: 'tegelen' },
              { order: 4, label: 'Vloer verwijderen - Op aanvraag', value: 'vloer-verwijderen' },
              { order: 5, label: 'Natuursteen behandelen - Op aanvraag', value: 'natuursteen' },
              { order: 6, label: 'Opslag - Op aanvraag', value: 'opslag' },
            ],
          },
        ],
      },
      // Step 2: Floor and Area
      {
        order: 1,
        description: 'Ruimte informatie',
        questions: [
          {
            order: 0,
            type: 'CHECKBOX',
            question: 'Welke verdieping(en)?',
            required: true,
            pricingImpact: 'NONE',
            options: floorOptions,
          },
          {
            order: 1,
            type: 'NUMBER',
            question: 'Aantal m²',
            required: true,
            pricingImpact: 'NONE',
            unit: 'm²',
            minValue: 1,
            placeholder: 'Voer het aantal m² in',
            options: [],
          },
        ],
      },
      // Step 3: Damage & Additional Surfaces
      {
        order: 2,
        description: 'Beschadigingen en extra oppervlaktes',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Zijn er beschadigingen of reparaties nodig?',
            required: true,
            pricingImpact: 'NONE',
            options: yesNoOptions,
          },
          {
            order: 1,
            type: 'CHECKBOX',
            question: 'Zijn er nog andere oppervlaktes?',
            required: true,
            pricingImpact: 'NONE',
            conditionalOn: { questionId: 'PLACEHOLDER_DAMAGE', value: 'Ja' },
            options: [
              { order: 0, label: 'Nee, geen andere oppervlakte(s)', value: 'Nee', isExclusive: true },
              { order: 1, label: 'Traptredes', value: 'Traptredes' },
              { order: 2, label: 'Opstapjes', value: 'Opstapjes' },
              { order: 3, label: 'Drempels', value: 'Drempels' },
              { order: 4, label: 'Dorpels', value: 'Dorpels' },
              { order: 5, label: 'Vensterbanken', value: 'Vensterbanken' },
              { order: 6, label: 'Planken / Plateaus', value: 'Planken' },
              { order: 7, label: 'Salontafels / Eettafels', value: 'Tafels' },
            ],
          },
        ],
      },
    ],
  });
}

// ============================================
// TRAPRENOVATIE CALCULATOR (Simplified)
// ============================================
async function seedTraprenovatie() {
  const stairCountOptions = [
    { order: 0, label: '0 (geen)', value: '0' },
    ...Array.from({ length: 15 }, (_, i) => ({
      order: i + 1,
      label: i === 14 ? '15+' : String(i + 1),
      value: i === 14 ? '15+' : String(i + 1),
    })),
  ];

  const stepCountOptions = Array.from({ length: 30 }, (_, i) => ({
    order: i,
    label: i === 29 ? '30+' : String(i + 1),
    value: i === 29 ? '30+' : String(i + 1),
  }));

  const yesNoOptions = [
    { order: 0, label: 'Ja', value: 'Ja' },
    { order: 1, label: 'Nee', value: 'Nee' },
  ];

  await createCalculator({
    name: 'Traprenovatie',
    slug: 'traprenovatie',
    description: 'Trap bekleden met diverse materialen',
    status: 'published',
    steps: [
      // Step 1: Material Selection
      {
        order: 0,
        description: 'Kies het materiaal',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Waarmee wilt u de trap bekleden?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Bekleden met PVC', value: 'pvc' },
              { order: 1, label: 'Bekleden met laminaat', value: 'laminaat' },
              { order: 2, label: 'Bekleden met hout', value: 'hout' },
              { order: 3, label: 'Bekleden met tapijt', value: 'tapijt' },
              { order: 4, label: 'Bekleden met traploper', value: 'traploper' },
              { order: 5, label: 'Bekleden met linoleum', value: 'linoleum' },
              { order: 6, label: 'Schuren en behandelen', value: 'behandelen' },
              { order: 7, label: 'Schuren en schilderen', value: 'schilderen' },
              { order: 8, label: 'Beton Ciré', value: 'betoncire' },
              { order: 9, label: 'Ben ik nog niet over uit', value: 'onbekend' },
              { order: 10, label: 'Ik wil graag advies', value: 'advies' },
            ],
          },
        ],
      },
      // Step 2: Open Stairs
      {
        order: 1,
        description: 'Open trappen',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Aantal open trap(pen)',
            required: true,
            pricingImpact: 'NONE',
            options: stairCountOptions.map((opt, i) => ({
              ...opt,
              label: i === 0 ? '0 (geen open trappen)' : opt.label,
              value: i === 0 ? '0 (geen open trappen)' : opt.value,
            })),
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Aantal totale treden in de open trap(pen)',
            required: true,
            pricingImpact: 'NONE',
            conditionalOn: {
              operator: 'OR',
              conditions: Array.from({ length: 15 }, (_, i) => ({
                questionId: 'PLACEHOLDER_OPEN_STAIRS',
                value: i === 14 ? '15+' : String(i + 1),
              })),
            },
            options: stepCountOptions,
          },
        ],
      },
      // Step 3: Closed Stairs
      {
        order: 2,
        description: 'Dichte trappen',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Aantal dichte trap(pen)',
            required: true,
            pricingImpact: 'NONE',
            options: stairCountOptions.map((opt, i) => ({
              ...opt,
              label: i === 0 ? '0 (geen dichte trappen)' : opt.label,
              value: i === 0 ? '0 (geen dichte trappen)' : opt.value,
            })),
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Aantal totale treden in de dichte trap(pen)',
            required: true,
            pricingImpact: 'NONE',
            conditionalOn: {
              operator: 'OR',
              conditions: Array.from({ length: 15 }, (_, i) => ({
                questionId: 'PLACEHOLDER_CLOSED_STAIRS',
                value: i === 14 ? '15+' : String(i + 1),
              })),
            },
            options: stepCountOptions,
          },
        ],
      },
      // Step 4: Stair Type and Options
      {
        order: 3,
        description: 'Type en opties',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Type open trap bekleding',
            required: true,
            pricingImpact: 'NONE',
            conditionalOn: {
              operator: 'OR',
              conditions: Array.from({ length: 15 }, (_, i) => ({
                questionId: 'PLACEHOLDER_OPEN_STAIRS',
                value: i === 14 ? '15+' : String(i + 1),
              })),
            },
            options: [
              { order: 0, label: 'Alleen bovenkant', value: 'bovenkant' },
              { order: 1, label: 'Rondom', value: 'rondom' },
            ],
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Type dichte trap bekleding',
            required: true,
            pricingImpact: 'NONE',
            conditionalOn: {
              operator: 'OR',
              conditions: Array.from({ length: 15 }, (_, i) => ({
                questionId: 'PLACEHOLDER_CLOSED_STAIRS',
                value: i === 14 ? '15+' : String(i + 1),
              })),
            },
            options: [
              { order: 0, label: 'Overzettrede', value: 'overzettrede' },
              { order: 1, label: 'Met profiel', value: 'profiel' },
              { order: 2, label: 'Doorlopend', value: 'doorlopend' },
            ],
          },
          {
            order: 2,
            type: 'SELECT',
            question: 'Stootborden mee bekleden?',
            required: true,
            pricingImpact: 'NONE',
            options: yesNoOptions,
          },
        ],
      },
      // Step 5: Additional Options
      {
        order: 4,
        description: 'Extra opties',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Verlichting gewenst?',
            required: true,
            pricingImpact: 'NONE',
            options: [
              { order: 0, label: 'Nee', value: 'Nee' },
              { order: 1, label: 'Statisch (vaste aan/uit)', value: 'statisch' },
              { order: 2, label: 'Per trede (elke trede apart)', value: 'per-trede' },
              { order: 3, label: 'Dynamisch (sensor)', value: 'dynamisch' },
            ],
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Demontage bestaande bekleding nodig?',
            required: true,
            pricingImpact: 'NONE',
            options: yesNoOptions,
          },
        ],
      },
      // Step 6: Overloop
      {
        order: 5,
        description: 'Overloop en entree',
        questions: [
          {
            order: 0,
            type: 'SELECT',
            question: 'Overloop mee bekleden?',
            required: true,
            pricingImpact: 'NONE',
            options: yesNoOptions,
          },
          {
            order: 1,
            type: 'SELECT',
            question: 'Entree mee bekleden?',
            required: true,
            pricingImpact: 'NONE',
            options: yesNoOptions,
          },
        ],
      },
    ],
  });
}

// ============================================
// MAIN SEED FUNCTION
// ============================================
async function main() {
  console.log('Starting calculator seeding...\n');

  try {
    await seedParketrenovatie();
    console.log('✓ Parketrenovatie calculator created\n');

    await seedVloerenLeggen();
    console.log('✓ Vloeren Leggen calculator created\n');

    await seedStofferen();
    console.log('✓ Stofferen calculator created\n');

    await seedOverig();
    console.log('✓ Overig calculator created\n');

    await seedTraprenovatie();
    console.log('✓ Traprenovatie calculator created\n');

    console.log('\n=== All calculators seeded successfully! ===');
  } catch (error) {
    console.error('Error seeding calculators:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
