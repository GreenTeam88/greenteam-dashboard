'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

import CalculatorFormBuilder from '@/components/calculators/CalculatorFormBuilder';
import { getCalculatorById } from '@/app/actions/calculatorActions';

import type { Product } from '@/types/calculator';

export default function EditCalculatorPage() {
  const params = useParams();
  const id = params.id as string;

  const [calculator, setCalculator] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalculator() {
      try {
        const data = await getCalculatorById(id);
        if (data) {
          setCalculator(data);
        } else {
          setError('Calculator not found');
        }
      } catch (err) {
        console.error('Error fetching calculator:', err);
        setError('Failed to load calculator');
      } finally {
        setLoading(false);
      }
    }
    fetchCalculator();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bgLightGreen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-bgPrimaryGreen border-t-transparent"></div>
      </div>
    );
  }

  if (error || !calculator) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-bgLightGreen">
        <p className="mb-4 text-lg text-red-500">{error || 'Calculator not found'}</p>
        <Link href="/dashboard/calculators" className="text-textGreenPrimary hover:underline">
          Back to Calculators
        </Link>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-textGreenPrimary">Edit Calculator: {calculator.name}</h1>
        <p className="text-sm text-gray-500">Modify your calculator steps and questions</p>
      </div>

      <CalculatorFormBuilder initialData={calculator} isEdit={true} />
    </div>
  );
}
