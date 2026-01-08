'use client';

import { useSortable } from '@dnd-kit/sortable';
import { ChevronDown, ChevronUp, GripVertical, Layers, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DeleteConfirmation } from './DeleteConfirmation';
import { QuestionFields } from './QuestionFields';

import type { OptionFormData, QuestionFormData, StepFormData } from '@/types/calculator';

interface FormStepEditorProps {
  step: StepFormData;
  index: number;
  allSteps: StepFormData[];
  updateStep: (tempId: string, updates: Partial<StepFormData>) => void;
  deleteStep: (tempId: string) => void;
  moveStep: (tempId: string, direction: 'up' | 'down') => void;
  addQuestion: (stepTempId: string) => void;
  updateQuestion: (stepTempId: string, questionTempId: string, updates: Partial<QuestionFormData>) => void;
  deleteQuestion: (stepTempId: string, questionTempId: string) => void;
  addOption: (stepTempId: string, questionTempId: string) => void;
  updateOption: (
    stepTempId: string,
    questionTempId: string,
    optionTempId: string,
    updates: Partial<OptionFormData>
  ) => void;
  deleteOption: (stepTempId: string, questionTempId: string, optionTempId: string) => void;
}

export function FormStepEditor({
  step,
  index,
  allSteps,
  deleteStep,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
}: FormStepEditorProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.tempId! });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.9 : 1,
  };

  const [collapsed, setCollapsed] = useState(false);
  const [localDescription, setLocalDescription] = useState(step.description || '');

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`relative overflow-hidden border transition-shadow ${
        isDragging ? 'shadow-lg ring-2 ring-bgPrimaryGreen/30' : 'shadow-sm hover:shadow-md'
      }`}
    >
      {/* Step Header */}
      <div className="flex items-center gap-3 border-b bg-gradient-to-r from-bgLightGreen to-white px-4 py-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-md bg-white shadow-sm transition-colors hover:bg-gray-50 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        {/* Step Badge */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bgPrimaryGreen text-xs font-bold text-white">
            {index + 1}
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-textGreenPrimary" />
            <span className="text-sm font-semibold text-textGreenPrimary">Step</span>
          </div>
        </div>

        {/* Step Description Input */}
        <div className="flex-1">
          <Input
            type="text"
            name={`step-${step.tempId}-description`}
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            placeholder="Enter step description (e.g., 'Select your service type')"
            className="h-9 border-gray-200 bg-white text-sm focus:border-bgPrimaryGreen focus:ring-bgPrimaryGreen"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Question count badge */}
          <div className="mr-2 flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            <span className="font-medium">{step.questions.length}</span>
            <span>{step.questions.length === 1 ? 'question' : 'questions'}</span>
          </div>

          {/* Collapse/Expand Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand step' : 'Collapse step'}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            )}
          </Button>

          {/* Delete Step Control */}
          <DeleteConfirmation
            onConfirm={() => deleteStep(step.tempId!)}
            title="Delete Step"
            description={`Are you sure you want to delete Step ${index + 1}? This will remove all ${step.questions.length} question(s) in this step. This action cannot be undone.`}
          />
        </div>
      </div>

      {/* Step Content */}
      {!collapsed && (
        <CardContent className="space-y-4 bg-gray-50/50 p-4">
          {step.questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white py-8">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bgLightGreen">
                <Plus className="h-6 w-6 text-textGreenPrimary" />
              </div>
              <p className="mb-3 text-sm text-gray-500">No questions in this step yet</p>
              <Button
                type="button"
                onClick={() => addQuestion(step.tempId!)}
                size="sm"
                className="bg-bgPrimaryGreen hover:bg-bgPrimaryGreen/90"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add First Question
              </Button>
            </div>
          ) : (
            <>
              {/* Questions List */}
              <div className="space-y-4">
                {step.questions.map((question, qIndex) => (
                  <QuestionFields
                    key={`${question.tempId}-${qIndex}`}
                    step={step}
                    question={question}
                    questionNum={qIndex + 1}
                    updateQuestion={updateQuestion}
                    deleteQuestion={deleteQuestion}
                    addOption={addOption}
                    updateOption={updateOption}
                    deleteOption={deleteOption}
                    allSteps={allSteps}
                    index={index}
                  />
                ))}
              </div>

              {/* Add Question Button */}
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addQuestion(step.tempId!)}
                  className="border-dashed border-gray-300 bg-white text-gray-600 hover:border-bgPrimaryGreen hover:bg-bgLightGreen hover:text-textGreenPrimary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question to Step {index + 1}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      )}

      {/* Collapsed State Indicator */}
      {collapsed && (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 text-sm text-gray-500">
          <span>
            {step.questions.length} {step.questions.length === 1 ? 'question' : 'questions'} configured
          </span>
          <button type="button" onClick={() => setCollapsed(false)} className="text-textGreenPrimary hover:underline">
            Click to expand
          </button>
        </div>
      )}
    </Card>
  );
}
