'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import CalculatorFormBuilder from '@/components/calculators/CalculatorFormBuilder';

export default function CreateCalculatorPage() {
  return (
    <div className="h-full w-full bg-bgLightGreen p-5">
      <div className="mb-6">
        <Link
          href="/dashboard/calculators"
          className="mb-2 inline-flex items-center text-sm text-textGreenPrimary hover:underline"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Calculators
        </Link>
        <h1 className="text-2xl font-bold text-textGreenPrimary">Create New Calculator</h1>
        <p className="text-sm text-gray-500">Build a dynamic price calculator with custom steps and questions</p>
      </div>

      <CalculatorFormBuilder />
    </div>
  );
}
