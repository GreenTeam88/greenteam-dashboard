import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/calculators/[slug] - Get a single calculator by slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug, status: 'published' },
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

    if (!product) {
      return NextResponse.json({ error: 'Calculator not found' }, { status: 404 });
    }

    // Transform the data for the frontend
    const calculator = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      baseImage: product.baseImageUrl,
      status: product.status,
      steps: product.steps.map((step) => ({
        id: step.id,
        order: step.order,
        description: step.description,
        questions: step.questions.map((question) => ({
          id: question.id,
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
          conditionalOn: question.conditionalOn,
          countThreshold: question.countThreshold,
          options: question.options.map((opt) => ({
            id: opt.id,
            label: opt.label,
            value: opt.value,
            price: opt.price,
            imageUrl: opt.imageUrl,
            order: opt.order,
            isExclusive: opt.isExclusive,
          })),
        })),
      })),
    };

    return NextResponse.json(calculator, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching calculator:', error);
    return NextResponse.json({ error: 'Failed to fetch calculator' }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
