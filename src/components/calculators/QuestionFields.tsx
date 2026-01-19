'use client';

import {
  CheckSquare,
  DollarSign,
  Hash,
  HelpCircle,
  Image as ImageIcon,
  List,
  Plus,
  Trash2,
  Type,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadFile } from '@/lib/upload';
import { ConditionalLogicSelector } from './ConditionalLogicSelector';
import { DeleteConfirmation } from './DeleteConfirmation';

import type { OptionFormData, PricingImpact, PriceVariants, QuestionFormData, StepFormData, StepType } from '@/types/calculator';

interface QuestionFieldsProps {
  step: StepFormData;
  question: QuestionFormData;
  questionNum: number;
  deleteQuestion: (stepTempId: string, questionTempId: string) => void;
  updateQuestion: (stepTempId: string, questionTempId: string, updates: Partial<QuestionFormData>) => void;
  addOption: (stepTempId: string, questionTempId: string) => void;
  updateOption: (
    stepTempId: string,
    questionTempId: string,
    optionTempId: string,
    updates: Partial<OptionFormData>
  ) => void;
  deleteOption: (stepTempId: string, questionTempId: string, optionTempId: string) => void;
  allSteps: StepFormData[];
  index: number;
}

const questionTypeIcons: Record<StepType, React.ReactNode> = {
  SELECT: <List className="h-4 w-4" />,
  NUMBER: <Hash className="h-4 w-4" />,
  CHECKBOX: <CheckSquare className="h-4 w-4" />,
  TEXT: <Type className="h-4 w-4" />,
  FILE_UPLOAD: <Upload className="h-4 w-4" />,
};

const pricingImpactColors: Record<PricingImpact, string> = {
  BASE: 'bg-blue-50 text-blue-700 border-blue-200',
  MULTIPLIER: 'bg-purple-50 text-purple-700 border-purple-200',
  ADDITIVE: 'bg-orange-50 text-orange-700 border-orange-200',
  COUNT_SELECTED: 'bg-teal-50 text-teal-700 border-teal-200',
  NONE: 'bg-gray-50 text-gray-600 border-gray-200',
};

export function QuestionFields({
  step,
  question,
  questionNum,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
  allSteps,
}: QuestionFieldsProps) {
  const { type, pricingImpact, options } = question;

  const handleUpdate = (updates: Partial<QuestionFormData>) => {
    updateQuestion(step.tempId!, question.tempId!, updates);
  };

  // Get the variant source question's options (for showing price variant inputs)
  const variantSourceQuestion = question.variantSourceQuestionId
    ? allSteps.flatMap((s) => s.questions).find((q) => (q.tempId || q.id) === question.variantSourceQuestionId)
    : null;
  const variantOptions = variantSourceQuestion?.options || [];

  // Helper to update a price variant for an option
  const updatePriceVariant = (optionTempId: string, variantLabel: string, price: number | null) => {
    const option = options.find((o) => o.tempId === optionTempId);
    if (!option) return;

    const currentVariants: PriceVariants = option.priceVariants || {};
    const newVariants: PriceVariants = { ...currentVariants };

    if (price === null || price === 0) {
      delete newVariants[variantLabel];
    } else {
      newVariants[variantLabel] = price;
    }

    updateOption(step.tempId!, question.tempId!, optionTempId, {
      priceVariants: Object.keys(newVariants).length > 0 ? newVariants : null,
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Question Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bgPrimaryGreen/10 text-textGreenPrimary">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Question {questionNum}</h4>
            <p className="text-xs text-gray-500">{type.replace('_', ' ').toLowerCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Pricing Impact Badge */}
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${pricingImpactColors[pricingImpact]}`}
          >
            {pricingImpact === 'NONE' ? 'No pricing' : pricingImpact.toLowerCase()}
          </span>
          {step.questions.length > 1 && (
            <DeleteConfirmation
              onConfirm={() => deleteQuestion(step.tempId!, question.tempId!)}
              title="Delete Question"
              description={`Are you sure you want to delete Question ${questionNum}? This action cannot be undone.`}
            />
          )}
        </div>
      </div>

      {/* Question Body */}
      <div className="space-y-4 p-4">
        {/* Type and Pricing Impact Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">Question Type</Label>
            <Select value={type} onValueChange={(value: StepType) => handleUpdate({ type: value })}>
              <SelectTrigger className="h-10 bg-white">
                <div className="flex items-center gap-2">
                  {questionTypeIcons[type]}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="SELECT">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-gray-500" />
                    <span>Dropdown Selection</span>
                  </div>
                </SelectItem>
                <SelectItem value="NUMBER">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span>Number Input</span>
                  </div>
                </SelectItem>
                <SelectItem value="CHECKBOX">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-gray-500" />
                    <span>Checkbox (Multi-select)</span>
                  </div>
                </SelectItem>
                <SelectItem value="TEXT">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-gray-500" />
                    <span>Text Input</span>
                  </div>
                </SelectItem>
                <SelectItem value="FILE_UPLOAD">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span>File Upload</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">Pricing Impact</Label>
            <Select
              value={pricingImpact}
              onValueChange={(value: PricingImpact) => handleUpdate({ pricingImpact: value })}
            >
              <SelectTrigger className="h-10 bg-white">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="BASE">
                  <div className="flex flex-col">
                    <span className="font-medium">Base Price</span>
                    <span className="text-xs text-gray-500">Options define the base price</span>
                  </div>
                </SelectItem>
                <SelectItem value="MULTIPLIER">
                  <div className="flex flex-col">
                    <span className="font-medium">Multiplier</span>
                    <span className="text-xs text-gray-500">Scales the total (e.g., m², quantity)</span>
                  </div>
                </SelectItem>
                <SelectItem value="ADDITIVE">
                  <div className="flex flex-col">
                    <span className="font-medium">Additive</span>
                    <span className="text-xs text-gray-500">Adds fixed cost per unit</span>
                  </div>
                </SelectItem>
                <SelectItem value="COUNT_SELECTED">
                  <div className="flex flex-col">
                    <span className="font-medium">Count Selected</span>
                    <span className="text-xs text-gray-500">Count items above threshold × price</span>
                  </div>
                </SelectItem>
                <SelectItem value="NONE">
                  <div className="flex flex-col">
                    <span className="font-medium">None</span>
                    <span className="text-xs text-gray-500">No pricing impact</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Question Label */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-700">
            Question Text <span className="text-red-500">*</span>
          </Label>
          <Input
            value={question.question || ''}
            onChange={(e) => handleUpdate({ question: e.target.value })}
            placeholder="e.g., Which service would you like?"
            className="bg-white"
            required
          />
        </div>

        {/* TEXT Input Specific Fields */}
        {type === 'TEXT' && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <Label className="mb-2 block text-xs font-medium text-gray-600">Text Input Settings</Label>
            <Input
              value={question.placeholder || ''}
              onChange={(e) => handleUpdate({ placeholder: e.target.value || null })}
              placeholder="Placeholder text (optional)"
              className="bg-white"
            />
          </div>
        )}

        {/* FILE_UPLOAD Specific Fields */}
        {type === 'FILE_UPLOAD' && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`required-upload-${question.tempId}`}
                checked={question.required}
                onChange={(e) => handleUpdate({ required: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-bgPrimaryGreen focus:ring-bgPrimaryGreen"
              />
              <Label htmlFor={`required-upload-${question.tempId}`} className="cursor-pointer text-sm text-gray-700">
                Mandatory upload (user must upload a file)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`multiple-files-${question.tempId}`}
                checked={question.allowMultiple || false}
                onChange={(e) => handleUpdate({ allowMultiple: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-bgPrimaryGreen focus:ring-bgPrimaryGreen"
              />
              <Label htmlFor={`multiple-files-${question.tempId}`} className="cursor-pointer text-sm text-gray-700">
                Allow multiple file uploads
              </Label>
            </div>
          </div>
        )}

        {/* NUMBER Input Specific Fields */}
        {type === 'NUMBER' && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <Label className="mb-3 block text-xs font-medium text-gray-600">Number Input Settings</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Unit Label</Label>
                <Input
                  value={question.unit || ''}
                  onChange={(e) => handleUpdate({ unit: e.target.value || null })}
                  placeholder="e.g., m², steps"
                  className="bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Default Value</Label>
                <Input
                  type="number"
                  value={question.defaultValue || ''}
                  onChange={(e) => handleUpdate({ defaultValue: parseFloat(e.target.value) || null })}
                  placeholder="0"
                  className="bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Min Value</Label>
                <Input
                  type="number"
                  value={question.minValue || ''}
                  onChange={(e) => handleUpdate({ minValue: parseFloat(e.target.value) || null })}
                  placeholder="0"
                  className="bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Max Value</Label>
                <Input
                  type="number"
                  value={question.maxValue || ''}
                  onChange={(e) => handleUpdate({ maxValue: parseFloat(e.target.value) || null })}
                  placeholder="No limit"
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Multiplies Price Of Question - for NUMBER inputs */}
        {type === 'NUMBER' && (
          <div className="rounded-lg border border-green-100 bg-green-50 p-3">
            <Label className="mb-2 block text-xs font-medium text-green-700">
              Multiplies Price From Question (Optional)
            </Label>
            <Select
              value={question.multipliesPriceOfQuestionId || 'none'}
              onValueChange={(value) => handleUpdate({ multipliesPriceOfQuestionId: value === 'none' ? null : value })}
            >
              <SelectTrigger className="h-10 bg-white">
                <SelectValue placeholder="Select a question..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="none">
                  <span className="text-gray-500">No multiplication (use as standalone value)</span>
                </SelectItem>
                {/* Show SELECT/CHECKBOX questions with BASE pricing from previous steps or earlier in current step */}
                {allSteps.flatMap((s) =>
                  s.questions
                    .filter((q) => {
                      // Only show questions that come before this one
                      const currentStepOrder = step.order;
                      const currentQuestionOrder = question.order;

                      if (s.order < currentStepOrder) {
                        return true; // All questions from previous steps
                      }
                      if (s.order === currentStepOrder && q.order < currentQuestionOrder) {
                        return true; // Questions in same step but before this one
                      }
                      return false;
                    })
                    .filter((q) => {
                      // Only show SELECT/CHECKBOX questions with BASE pricing (they have option prices)
                      return (q.type === 'SELECT' || q.type === 'CHECKBOX') && q.pricingImpact === 'BASE';
                    })
                    .map((q) => (
                      <SelectItem key={q.tempId || q.id} value={q.tempId || q.id || ''}>
                        <div className="flex flex-col">
                          <span className="font-medium">{q.question || 'Unnamed question'}</span>
                          <span className="text-xs text-gray-500">
                            Step {s.order + 1} • {q.type} • BASE pricing
                          </span>
                        </div>
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
            <p className="mt-1.5 text-xs text-green-600">
              When set, this number value will be multiplied by the selected option&apos;s price from the chosen question.
              <br />
              Example: 50 (m²) × €30 (service price) = €1,500
            </p>
          </div>
        )}

        {/* ADDITIVE Pricing Field */}
        {pricingImpact === 'ADDITIVE' && (
          <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
            <Label className="mb-2 block text-xs font-medium text-orange-700">
              Price Per Unit <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
              <Input
                type="number"
                step="0.01"
                value={question.pricePerUnit || ''}
                onChange={(e) => handleUpdate({ pricePerUnit: parseFloat(e.target.value) || null })}
                placeholder="0.00"
                className="bg-white pl-8"
                required
              />
            </div>
            <p className="mt-1.5 text-xs text-orange-600">
              This amount will be multiplied by the user&apos;s input value
            </p>
          </div>
        )}

        {/* COUNT_SELECTED Pricing Field (for floor costs, etc.) */}
        {pricingImpact === 'COUNT_SELECTED' && (
          <div className="rounded-lg border border-teal-100 bg-teal-50 p-3">
            <Label className="mb-3 block text-xs font-medium text-teal-700">Count Selected Pricing Settings</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-teal-600">
                  Price Per Item <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={question.pricePerUnit || ''}
                    onChange={(e) => handleUpdate({ pricePerUnit: parseFloat(e.target.value) || null })}
                    placeholder="25.00"
                    className="bg-white pl-8"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-teal-600">Count Items Above</Label>
                <Input
                  type="number"
                  value={question.countThreshold ?? 0}
                  onChange={(e) => handleUpdate({ countThreshold: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-white"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-teal-600">
              Counts selected items with numeric value above threshold. E.g., for floors: set threshold to 0 to only
              count floors above ground level (€25 each).
            </p>
          </div>
        )}

        {/* Multiply By Question Field - for multiplying option price by another question's value */}
        {(pricingImpact === 'BASE' || pricingImpact === 'ADDITIVE') && (type === 'SELECT' || type === 'CHECKBOX') && (
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
            <Label className="mb-2 block text-xs font-medium text-indigo-700">
              Multiply Price By Question Value (Optional)
            </Label>
            <Select
              value={question.multiplyByQuestionId || 'none'}
              onValueChange={(value) => handleUpdate({ multiplyByQuestionId: value === 'none' ? null : value })}
            >
              <SelectTrigger className="h-10 bg-white">
                <SelectValue placeholder="Select a question..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="none">
                  <span className="text-gray-500">No multiplication (use option price as-is)</span>
                </SelectItem>
                {/* Show all questions from previous steps and current step that come before this question */}
                {allSteps.flatMap((s) =>
                  s.questions
                    .filter((q) => {
                      // Only show questions that come before this one
                      const currentStepOrder = step.order;
                      const currentQuestionOrder = question.order;

                      if (s.order < currentStepOrder) {
                        return true; // All questions from previous steps
                      }
                      if (s.order === currentStepOrder && q.order < currentQuestionOrder) {
                        return true; // Questions in same step but before this one
                      }
                      return false;
                    })
                    .filter((q) => {
                      // Only show questions that can have numeric values
                      return q.type === 'NUMBER' || q.type === 'SELECT';
                    })
                    .map((q) => (
                      <SelectItem key={q.tempId || q.id} value={q.tempId || q.id || ''}>
                        <div className="flex flex-col">
                          <span className="font-medium">{q.question || 'Unnamed question'}</span>
                          <span className="text-xs text-gray-500">
                            Step {s.order + 1} • {q.type}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
            <p className="mt-1.5 text-xs text-indigo-600">
              When set, the selected option&apos;s price will be multiplied by the value from the chosen question.
              <br />
              Example: €300 (Rondom) × 15 (treads) = €4,500
            </p>
          </div>
        )}

        {/* Price Variants Source - ONLY show if there are SELECT questions with 3+ options before this */}
        {pricingImpact === 'BASE' && (type === 'SELECT' || type === 'CHECKBOX') && (() => {
          const serviceQuestions = allSteps.flatMap((s) =>
            s.questions.filter((q) => {
              if (s.order < step.order) return q.type === 'SELECT' && q.options.length >= 3;
              if (s.order === step.order && q.order < question.order) return q.type === 'SELECT' && q.options.length >= 3;
              return false;
            })
          );
          if (serviceQuestions.length === 0) return null;

          return (
            <div className="rounded border border-dashed border-gray-300 p-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!question.variantSourceQuestionId}
                  onChange={(e) => {
                    if (e.target.checked && serviceQuestions.length > 0) {
                      handleUpdate({ variantSourceQuestionId: serviceQuestions[0].tempId || serviceQuestions[0].id });
                    } else {
                      handleUpdate({ variantSourceQuestionId: null });
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-xs text-gray-600">Different prices per service (for Traprenovatie)</span>
              </label>
              {question.variantSourceQuestionId && serviceQuestions.length > 1 && (
                <Select
                  value={question.variantSourceQuestionId || ''}
                  onValueChange={(value) => handleUpdate({ variantSourceQuestionId: value })}
                >
                  <SelectTrigger className="mt-2 h-8 text-xs bg-white">
                    <SelectValue placeholder="Select service question..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {serviceQuestions.map((q) => (
                      <SelectItem key={q.tempId || q.id} value={q.tempId || q.id || ''}>
                        {q.question || 'Unnamed'} ({q.options.length} options)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          );
        })()}

        {/* SELECT or CHECKBOX Options Field */}
        {(type === 'SELECT' || type === 'CHECKBOX') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-700">
                Options {pricingImpact === 'BASE' && <span className="text-gray-400">(with prices)</span>}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addOption(step.tempId!, question.tempId!)}
                className="h-7 text-xs"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add Option
              </Button>
            </div>

            {options.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-6">
                <p className="mb-2 text-sm text-gray-500">No options added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(step.tempId!, question.tempId!)}
                  className="text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add First Option
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {options.map((option, optionIndex) => (
                  <div
                    key={`${option.tempId}-${optionIndex}`}
                    className="group flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-gray-300"
                  >
                    {/* Option Number */}
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-500">
                      {optionIndex + 1}
                    </div>

                    {/* Option Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            value={option.label}
                            onChange={(e) =>
                              updateOption(step.tempId!, question.tempId!, option.tempId!, {
                                label: e.target.value,
                                value: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                              })
                            }
                            placeholder="Option label"
                            className="h-9 bg-white text-sm"
                            required
                          />
                        </div>
                        {pricingImpact === 'BASE' && (
                          <div className="w-28">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
                              <Input
                                type="number"
                                step="0.01"
                                value={option.price || ''}
                                onChange={(e) =>
                                  updateOption(step.tempId!, question.tempId!, option.tempId!, {
                                    price: parseFloat(e.target.value) || null,
                                  })
                                }
                                placeholder="0.00"
                                className="h-9 bg-white pl-6 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price Variants - compact grid when variant source is selected */}
                      {pricingImpact === 'BASE' && variantOptions.length > 0 && (
                        <div className="mt-2 rounded border border-emerald-200 bg-emerald-50 p-2">
                          <div className="grid grid-cols-3 gap-2">
                            {variantOptions.map((variant) => (
                              <div key={variant.tempId || variant.value} className="flex flex-col">
                                <label className="text-[10px] font-medium text-emerald-700 mb-0.5 truncate" title={variant.label}>
                                  {variant.label}
                                </label>
                                <div className="relative">
                                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={option.priceVariants?.[variant.label] || ''}
                                    onChange={(e) =>
                                      updatePriceVariant(
                                        option.tempId!,
                                        variant.label,
                                        parseFloat(e.target.value) || null
                                      )
                                    }
                                    placeholder={String(option.price || 0)}
                                    className="h-8 bg-white text-sm pl-5"
                                    title={variant.label}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Upload and Exclusive Option Row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {option.imageUrl ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={option.imageUrl}
                                alt={option.label}
                                className="h-10 w-10 rounded border object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23ddd"/%3E%3C/svg%3E';
                                }}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateOption(step.tempId!, question.tempId!, option.tempId!, {
                                    imageUrl: null,
                                    imagePublicId: null,
                                  })
                                }
                                className="h-7 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="flex cursor-pointer items-center gap-1.5 rounded border border-dashed border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-100">
                              <ImageIcon className="h-3 w-3" />
                              <span>Add image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files ? e.target.files[0] : null;
                                  if (file) {
                                    uploadFile(file).then((data) => {
                                      updateOption(step.tempId!, question.tempId!, option.tempId!, {
                                        imageUrl: data.secure_url,
                                      });
                                    });
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>

                        {/* Exclusive Option Toggle (for CHECKBOX only) */}
                        {type === 'CHECKBOX' && (
                          <label className="flex cursor-pointer items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs transition-colors hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={option.isExclusive || false}
                              onChange={(e) =>
                                updateOption(step.tempId!, question.tempId!, option.tempId!, {
                                  isExclusive: e.target.checked,
                                })
                              }
                              className="h-3 w-3 rounded border-gray-300 text-bgPrimaryGreen focus:ring-bgPrimaryGreen"
                            />
                            <span className="text-gray-600">Exclusive</span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Delete Option */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOption(step.tempId!, question.tempId!, option.tempId!)}
                      className="h-8 w-8 shrink-0 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conditional Logic */}
        <ConditionalLogicSelector step={step} question={question} allSteps={allSteps} updateQuestion={updateQuestion} />
      </div>
    </div>
  );
}
