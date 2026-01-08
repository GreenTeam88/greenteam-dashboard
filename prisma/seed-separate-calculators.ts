import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Services configuration matching the static calculator
const servicesConfig: Record<string, Record<string, number | null>> = {
  Parketrenovatie: {
    'Schuren + polijsten + (zonder behandeling)': 20.0,
    'Schuren + polijsten + oliën naturel': 30.0,
    'Schuren + polijsten + oliën in kleur': 35.0,
    'Schuren + polijsten + hardwax naturel': 35.0,
    'Schuren + polijsten + hardwax in kleur': 37.5,
    'Schuren + polijsten + lakken in naturel': 40.0,
    'Schuren + polijsten + lakken in kleur': 46.5,
    'Schuren + polijsten + lakken met Skylt': 42.5,
    'Schuren + polijsten + olie + lak': 47.5,
    'Schuren + polijsten + lak zwartmat': 65.0,
    'Schuren + polijsten + lak wit mat': 65.0,
    'Ben ik nog niet over uit': 0.0,
    'Ik wil graag advies': 0.0,
  },
  Traprenovatie: {
    'Bekleden met PVC': null,
    'Bekleden met laminaat': null,
    'Bekleden met hout': null,
    'Bekleden met tapijt': null,
    'Bekleden met traploper': null,
    'Bekleden met linoleum': null,
    'Schuren en behandelen': null,
    'Schuren en schilderen': null,
    'Beton Ciré': null,
    'Ben ik nog niet over uit': 0.0,
    'Ik wil graag advies': 0.0,
  },
  'Vloeren leggen': {
    Parket: null,
    Laminaat: null,
    'PVC (klik)': null,
    'PVC (plak)': null,
    Tapijt: null,
    Linoleum: null,
  },
  Stofferen: {
    Vloer: 40.0,
    Tapijttegels: 30.0,
    Deurmat: null,
    Droogloopmat: null,
    'Rode loper': null,
    Bedrijfshal: null,
    'Ben ik nog niet over uit': 0.0,
    'Ik wil graag advies': 0.0,
  },
  Overig: {
    Vloerverwarming: null,
    Egaliseren: null,
    Gietvloeren: null,
    Tegelen: null,
    'Vloer verwijderen': null,
    'Natuursteen behandelen': null,
    Opslag: null,
  },
};

// Category to slug mapping
const categoryToSlug: Record<string, string> = {
  Parketrenovatie: 'parketrenovatie',
  Traprenovatie: 'traprenovatie',
  'Vloeren leggen': 'vloeren-leggen',
  Stofferen: 'stofferen',
  Overig: 'overig',
};

// All categories
const allCategories = Object.keys(servicesConfig);

async function createSeparateCalculators() {
  console.log('Deleting all existing calculators...');

  // Delete in order due to foreign key constraints
  await prisma.stepOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.formStep.deleteMany();
  await prisma.product.deleteMany();

  console.log('All existing calculators deleted.\n');

  // Create a calculator for each category
  for (const category of allCategories) {
    const slug = categoryToSlug[category];
    const services = servicesConfig[category];

    console.log(`Creating calculator for: ${category} (slug: ${slug})`);

    // Create the product/calculator
    const product = await prisma.product.create({
      data: {
        name: `${category} Calculator`,
        slug: slug,
        description: `Calculator voor ${category}`,
        status: 'published',
      },
    });

    // Create Step 1: Service Selection (just the service, no category dropdown)
    const step1 = await prisma.formStep.create({
      data: {
        productId: product.id,
        order: 0,
        description: 'Waar kunnen we u mee helpen?',
      },
    });

    // Only one question: Service selection (specific to this category)
    const serviceEntries = Object.entries(services);
    const serviceQuestion = await prisma.question.create({
      data: {
        stepId: step1.id,
        order: 0,
        type: 'SELECT',
        question: 'Wat wilt u gedaan hebben?',
        required: true,
        pricingImpact: 'BASE',
      },
    });

    // Create options for service question
    for (let i = 0; i < serviceEntries.length; i++) {
      const [serviceName, price] = serviceEntries[i];
      let label: string;
      if (category === 'Vloeren leggen' || category === 'Traprenovatie') {
        label = serviceName;
      } else if (price === 0.0) {
        label = `${serviceName} - Gratis`;
      } else if (price === null) {
        label = `${serviceName} - Op aanvraag`;
      } else {
        label = `${serviceName} - €${price.toFixed(2)}`;
      }

      await prisma.stepOption.create({
        data: {
          questionId: serviceQuestion.id,
          order: i,
          label: label,
          value: serviceName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
          price: price ?? undefined,
        },
      });
    }

    console.log(`   Step 1 created with ${serviceEntries.length} service options`);

    // Create Step 2: Placeholder for additional questions (to be configured in dashboard)
    await prisma.formStep.create({
      data: {
        productId: product.id,
        order: 1,
        description: 'Aanvullende informatie',
      },
    });

    console.log(`   Step 2 (placeholder) created`);

    // Create Final Step: Contact Information
    const contactStep = await prisma.formStep.create({
      data: {
        productId: product.id,
        order: 2,
        description: 'Uw gegevens',
      },
    });

    // Add contact form questions
    await prisma.question.create({
      data: {
        stepId: contactStep.id,
        order: 0,
        type: 'TEXT',
        question: 'Voornaam',
        required: true,
        pricingImpact: 'NONE',
      },
    });

    await prisma.question.create({
      data: {
        stepId: contactStep.id,
        order: 1,
        type: 'TEXT',
        question: 'Achternaam',
        required: true,
        pricingImpact: 'NONE',
      },
    });

    await prisma.question.create({
      data: {
        stepId: contactStep.id,
        order: 2,
        type: 'TEXT',
        question: 'E-mailadres',
        required: true,
        pricingImpact: 'NONE',
      },
    });

    await prisma.question.create({
      data: {
        stepId: contactStep.id,
        order: 3,
        type: 'TEXT',
        question: 'Telefoonnummer',
        required: true,
        pricingImpact: 'NONE',
      },
    });

    await prisma.question.create({
      data: {
        stepId: contactStep.id,
        order: 4,
        type: 'TEXT',
        question: 'Postcode',
        required: true,
        pricingImpact: 'NONE',
      },
    });

    await prisma.question.create({
      data: {
        stepId: contactStep.id,
        order: 5,
        type: 'TEXT',
        question: 'Huisnummer',
        required: true,
        pricingImpact: 'NONE',
      },
    });

    await prisma.question.create({
      data: {
        stepId: contactStep.id,
        order: 6,
        type: 'TEXT',
        question: 'Opmerkingen',
        required: false,
        pricingImpact: 'NONE',
        multiline: true,
      },
    });

    console.log(`   Contact step created with form fields`);
    console.log(`   Calculator "${category}" created successfully!\n`);
  }

  console.log('All 5 calculators created successfully!');
  console.log('\nCalculators created:');
  const products = await prisma.product.findMany({
    include: {
      steps: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });

  for (const product of products) {
    console.log(`  - ${product.name} (/${product.slug})`);
    console.log(`    Steps: ${product.steps.length}`);
    for (const step of product.steps) {
      console.log(`      Step ${step.order + 1}: ${step.description} (${step.questions.length} questions)`);
    }
  }
}

createSeparateCalculators()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
