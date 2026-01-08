'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Link2, Info } from 'lucide-react';

interface CalculatorInfoFormProps {
  calculatorName: string;
  setCalculatorName: (name: string) => void;
  calculatorSlug: string;
  setCalculatorSlug: (slug: string) => void;
  setIsSlugManuallyEdited: (isEdited: boolean) => void;
  calculatorDescription: string;
  setCalculatorDescription: (desc: string) => void;
}

export function CalculatorInfoForm({
  calculatorName,
  setCalculatorName,
  calculatorSlug,
  setCalculatorSlug,
  setIsSlugManuallyEdited,
  calculatorDescription,
  setCalculatorDescription,
}: CalculatorInfoFormProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-bgLightGreen to-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bgPrimaryGreen text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-textGreenPrimary">Calculator Information</CardTitle>
            <p className="text-sm text-gray-500">Basic details about your calculator</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        {/* Calculator Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-1 text-sm font-medium text-gray-700">
            Calculator Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={calculatorName}
            onChange={(e) => setCalculatorName(e.target.value)}
            placeholder="e.g., Parquet Renovation Calculator"
            required
            className="h-11 bg-white focus:border-bgPrimaryGreen focus:ring-bgPrimaryGreen"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Link2 className="h-4 w-4 text-gray-400" />
            URL Slug
          </Label>
          <div className="flex items-center gap-2">
            <span className="rounded-l-md border border-r-0 border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
              /calculator/
            </span>
            <Input
              id="slug"
              value={calculatorSlug}
              onChange={(e) => {
                setCalculatorSlug(e.target.value);
                setIsSlugManuallyEdited(true);
              }}
              placeholder="parquet-renovation"
              className="h-11 flex-1 rounded-l-none bg-white focus:border-bgPrimaryGreen focus:ring-bgPrimaryGreen"
            />
          </div>
          <div className="flex items-start gap-1.5">
            <Info className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />
            <p className="text-xs text-gray-500">
              Auto-generated from the calculator name. Edit manually if you need a custom URL.
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            id="description"
            value={calculatorDescription}
            onChange={(e) => setCalculatorDescription(e.target.value)}
            placeholder="Briefly describe what this calculator does and who it's for..."
            rows={3}
            className="resize-none bg-white focus:border-bgPrimaryGreen focus:ring-bgPrimaryGreen"
          />
          <p className="text-xs text-gray-500">
            This description may be shown to users on the calculator page.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
