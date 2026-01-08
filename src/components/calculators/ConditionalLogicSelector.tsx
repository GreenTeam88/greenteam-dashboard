'use client';

import { GitBranch, Info, Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isConditionalLogic, isConditionalRule } from '@/types/calculator';

import type {
  ConditionalLogic,
  ConditionalOperator,
  ConditionalRule,
  QuestionFormData,
  StepFormData,
} from '@/types/calculator';

interface ConditionalLogicSelectorProps {
  step: StepFormData;
  question: QuestionFormData;
  allSteps: StepFormData[];
  updateQuestion: (stepTempId: string, questionTempId: string, updates: Partial<QuestionFormData>) => void;
}

interface AvailableOption {
  stepTempId: string;
  stepOrder: number;
  questionTempId: string;
  questionOrder: number;
  questionText: string;
  optionValue: string;
  optionLabel: string;
}

export function ConditionalLogicSelector({ step, question, allSteps, updateQuestion }: ConditionalLogicSelectorProps) {
  // Get current conditions from question
  const getCurrentConditions = (): { operator: ConditionalOperator; conditions: ConditionalRule[] } => {
    if (!question.conditionalOn) {
      return { operator: 'OR', conditions: [] };
    }
    if (isConditionalLogic(question.conditionalOn)) {
      return question.conditionalOn;
    }
    if (isConditionalRule(question.conditionalOn)) {
      // Convert legacy single condition to new format
      return { operator: 'OR', conditions: [question.conditionalOn] };
    }
    return { operator: 'OR', conditions: [] };
  };

  const [operator, setOperator] = useState<ConditionalOperator>(getCurrentConditions().operator);
  const [conditions, setConditions] = useState<ConditionalRule[]>(getCurrentConditions().conditions);

  // Build list of available parent questions and their options
  const availableOptions: AvailableOption[] = [];
  allSteps.forEach((s) => {
    if (s.order < step.order) {
      s.questions.forEach((q) => {
        if (q.type === 'SELECT' || q.type === 'CHECKBOX') {
          q.options.forEach((opt) => {
            availableOptions.push({
              stepTempId: s.tempId!,
              stepOrder: s.order,
              questionTempId: q.tempId!,
              questionOrder: q.order,
              questionText: q.question || `Question ${q.order + 1}`,
              optionValue: opt.value,
              optionLabel: opt.label,
            });
          });
        }
      });
    } else if (s.order === step.order) {
      s.questions.forEach((q) => {
        if (q.order < question.order && (q.type === 'SELECT' || q.type === 'CHECKBOX')) {
          q.options.forEach((opt) => {
            availableOptions.push({
              stepTempId: s.tempId!,
              stepOrder: s.order,
              questionTempId: q.tempId!,
              questionOrder: q.order,
              questionText: q.question || `Question ${q.order + 1}`,
              optionValue: opt.value,
              optionLabel: opt.label,
            });
          });
        }
      });
    }
  });

  const isFirstQuestionInFirstStep = step.order === 0 && question.order === 0;
  const hasConditions = conditions.length > 0;

  const handleUpdate = (newConditions: ConditionalRule[], newOperator: ConditionalOperator) => {
    if (newConditions.length === 0) {
      updateQuestion(step.tempId!, question.tempId!, { conditionalOn: null });
    } else if (newConditions.length === 1) {
      // Single condition - use simple format for backward compatibility
      updateQuestion(step.tempId!, question.tempId!, { conditionalOn: newConditions[0] });
    } else {
      // Multiple conditions - use new format
      const logic: ConditionalLogic = { operator: newOperator, conditions: newConditions };
      updateQuestion(step.tempId!, question.tempId!, { conditionalOn: logic });
    }
  };

  const addCondition = () => {
    if (availableOptions.length === 0) return;
    const firstOption = availableOptions[0];
    const newCondition: ConditionalRule = {
      questionId: firstOption.questionTempId,
      value: firstOption.optionValue,
    };
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    handleUpdate(newConditions, operator);
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    handleUpdate(newConditions, operator);
  };

  const updateCondition = (index: number, questionId: string, value: string) => {
    const newConditions = conditions.map((c, i) => (i === index ? { questionId, value } : c));
    setConditions(newConditions);
    handleUpdate(newConditions, operator);
  };

  const updateOperator = (newOperator: ConditionalOperator) => {
    setOperator(newOperator);
    handleUpdate(conditions, newOperator);
  };

  const getOptionLabel = (questionId: string, value: string) => {
    const option = availableOptions.find((o) => o.questionTempId === questionId && o.optionValue === value);
    if (option) {
      return `S${option.stepOrder + 1} Q${option.questionOrder + 1}: ${option.optionLabel}`;
    }
    return 'Select condition';
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        hasConditions ? 'border-purple-200 bg-purple-50' : 'border-gray-100 bg-gray-50'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded ${
              hasConditions ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
          </div>
          <Label className="text-xs font-medium text-gray-700">Conditional Logic</Label>
          {hasConditions && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              {conditions.length} condition{conditions.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {!isFirstQuestionInFirstStep && availableOptions.length > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={addCondition} className="h-7 text-xs">
            <Plus className="mr-1 h-3 w-3" />
            Add Condition
          </Button>
        )}
      </div>

      {isFirstQuestionInFirstStep ? (
        <div className="flex items-start gap-1.5">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />
          <p className="text-xs text-gray-500">The first question cannot have conditional logic.</p>
        </div>
      ) : availableOptions.length === 0 ? (
        <div className="flex items-start gap-1.5">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />
          <p className="text-xs text-gray-500">No previous SELECT or CHECKBOX questions available for conditions.</p>
        </div>
      ) : (
        <>
          {conditions.length > 1 && (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs text-gray-600">Show when</span>
              <Select value={operator} onValueChange={(v) => updateOperator(v as ConditionalOperator)}>
                <SelectTrigger className="h-7 w-20 bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="OR">ANY</SelectItem>
                  <SelectItem value="AND">ALL</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-600">of these conditions are met:</span>
            </div>
          )}

          {conditions.length === 0 ? (
            <div className="flex items-start gap-1.5">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />
              <p className="text-xs text-gray-500">
                No conditions set. This question will always be shown. Click &quot;Add Condition&quot; to show this
                question only when specific answers are selected.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="w-8 text-center text-xs font-medium text-purple-600">
                      {operator === 'OR' ? 'OR' : 'AND'}
                    </span>
                  )}
                  <div className={`flex-1 ${index === 0 ? '' : ''}`}>
                    <Select
                      value={`${condition.questionId}|||${condition.value}`}
                      onValueChange={(v) => {
                        const [qId, val] = v.split('|||');
                        updateCondition(index, qId, val);
                      }}
                    >
                      <SelectTrigger className="h-9 bg-white text-xs">
                        <SelectValue>{getOptionLabel(condition.questionId, condition.value)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white">
                        {availableOptions.map((opt, optIndex) => (
                          <SelectItem
                            key={`${opt.questionTempId}-${opt.optionValue}-${optIndex}`}
                            value={`${opt.questionTempId}|||${opt.optionValue}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                                S{opt.stepOrder + 1} Q{opt.questionOrder + 1}
                              </span>
                              <span className="truncate">{opt.optionLabel}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(index)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {conditions.length > 0 && (
            <div className="mt-3 flex items-start gap-1.5 border-t border-purple-200 pt-3">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />
              <p className="text-xs text-purple-600">
                {conditions.length === 1
                  ? 'This question will only show when the selected condition is met.'
                  : operator === 'OR'
                    ? 'This question will show when ANY of the conditions are met.'
                    : 'This question will show when ALL conditions are met.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
