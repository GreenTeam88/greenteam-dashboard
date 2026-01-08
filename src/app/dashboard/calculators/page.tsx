'use client';

import { useState, useEffect } from 'react';

import CalculatorsDataTable from '@/components/calculators/CalculatorsDataTable';
import SortBy from '@/components/SortBy';
import { getCalculatorsForTable } from '@/app/actions/calculatorActions';

import type { ProductTableRow } from '@/types/calculator';

export default function CalculatorsPage() {
  const [filterType, setFilterType] = useState('All');
  const [calculators, setCalculators] = useState<ProductTableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalculators() {
      try {
        const data = await getCalculatorsForTable();
        setCalculators(data);
      } catch (error) {
        console.error('Error fetching calculators:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCalculators();
  }, []);

  return (
    <div className="h-full w-full bg-bgLightGreen p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textGreenPrimary">Calculators</h1>
          <p className="text-sm text-gray-500">Manage your dynamic price calculators</p>
        </div>
        <SortBy />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-bgPrimaryGreen border-t-transparent"></div>
        </div>
      ) : (
        <CalculatorsDataTable calculators={calculators} activeFilter={filterType} setActiveFilter={setFilterType} />
      )}
    </div>
  );
}
