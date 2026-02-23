// Calculator Builder Type Definitions

export type StepType = 'SELECT' | 'NUMBER' | 'TEXT' | 'TEXT_ONLY' | 'CHECKBOX' | 'FILE_UPLOAD';

export type PricingImpact = 'BASE' | 'MULTIPLIER' | 'ADDITIVE' | 'NONE' | 'COUNT_SELECTED';

export type ProductStatus = 'draft' | 'published';

export type ConditionalOperator = 'AND' | 'OR';

// Single condition
export interface ConditionalRule {
  questionId: string;
  value: string; // For single value match
  values?: string[]; // For matching any of multiple values
}

// Multiple conditions with operator
export interface ConditionalLogic {
  operator: ConditionalOperator;
  conditions: ConditionalRule[];
}

// Price variants type - maps service/variant name to price
export type PriceVariants = Record<string, number>;

// Database models (from Prisma)
export interface StepOption {
  id: string;
  questionId: string;
  label: string;
  value: string;
  price: number | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  order: number;
  isExclusive?: boolean; // When selected, deselects all other options
  priceVariants?: PriceVariants | null; // Different prices per service type
}

export interface Question {
  id: string;
  stepId: string;
  order: number;
  type: StepType;
  question: string;
  required: boolean;
  pricingImpact: PricingImpact;
  pricePerUnit: number | null;
  unit: string | null;
  minValue: number | null;
  maxValue: number | null;
  defaultValue: number | null;
  placeholder: string | null;
  minLength: number | null;
  maxLength: number | null;
  multiline: boolean;
  acceptedFileTypes: string | null;
  maxFileSize: number | null;
  allowMultiple: boolean;
  // Updated: supports both legacy single condition and new multiple conditions
  conditionalOn: ConditionalRule | ConditionalLogic | null;
  // For COUNT_SELECTED pricing: count items matching criteria and multiply by pricePerUnit
  countThreshold?: number; // Only count items > this value (e.g., 0 for floors above ground)
  // Multiply price by another question's value (for Traprenovatie: price × number of treads)
  multiplyByQuestionId?: string | null;
  // Price variants: which question's answer determines the price variant to use
  variantSourceQuestionId?: string | null;
  // For NUMBER/SELECT: this question's value multiplies the price from referenced question
  multipliesPriceOfQuestionId?: string | null;
  options: StepOption[];
}

export interface FormStep {
  id: string;
  productId: string;
  order: number;
  description: string | null;
  questions: Question[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  baseImageUrl: string | null;
  baseImagePublicId: string | null;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  steps: FormStep[];
}

// Form data types (for the builder)
export interface OptionFormData {
  tempId?: string;
  id?: string;
  label: string;
  value: string;
  price: number | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  order: number;
  isExclusive?: boolean;
  priceVariants?: PriceVariants | null;
}

export interface QuestionFormData {
  tempId?: string;
  id?: string;
  order: number;
  type: StepType;
  question: string;
  required: boolean;
  pricingImpact: PricingImpact;
  pricePerUnit: number | null;
  unit: string | null;
  minValue: number | null;
  maxValue: number | null;
  defaultValue: number | null;
  placeholder: string | null;
  minLength: number | null;
  maxLength: number | null;
  multiline: boolean;
  acceptedFileTypes: string | null;
  maxFileSize: number | null;
  allowMultiple: boolean;
  conditionalOn: ConditionalRule | ConditionalLogic | null;
  countThreshold?: number | null;
  multiplyByQuestionId?: string | null;
  variantSourceQuestionId?: string | null;
  multipliesPriceOfQuestionId?: string | null;
  options: OptionFormData[];
}

export interface StepFormData {
  tempId?: string;
  id?: string;
  order: number;
  description: string | null;
  questions: QuestionFormData[];
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string | null;
  baseImageUrl: string | null;
  baseImagePublicId: string | null;
  status: ProductStatus;
  steps: StepFormData[];
}

// Price calculation types
export interface PriceBreakdown {
  basePrice: number;
  multipliers: Array<{ label: string; factor: number }>;
  additions: Array<{ label: string; amount: number }>;
  total: number;
}

// API response types
export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: Product | ProductTableRow;
}

// Table display type
export interface ProductTableRow {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  order: number;
  stepsCount: number;
  questionsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Handler types for form builder
export type UpdateStepHandler = (stepIndex: number, field: keyof StepFormData, value: unknown) => void;
export type DeleteStepHandler = (stepIndex: number) => void;
export type MoveStepHandler = (stepIndex: number, direction: 'up' | 'down') => void;
export type AddQuestionHandler = (stepIndex: number) => void;
export type UpdateQuestionHandler = (
  stepIndex: number,
  questionIndex: number,
  field: keyof QuestionFormData,
  value: unknown
) => void;
export type DeleteQuestionHandler = (stepIndex: number, questionIndex: number) => void;
export type AddOptionHandler = (stepIndex: number, questionIndex: number) => void;
export type UpdateOptionHandler = (
  stepIndex: number,
  questionIndex: number,
  optionIndex: number,
  field: keyof OptionFormData,
  value: unknown
) => void;
export type DeleteOptionHandler = (stepIndex: number, questionIndex: number, optionIndex: number) => void;

// Helper to check if conditionalOn is multiple conditions
export function isConditionalLogic(
  conditionalOn: ConditionalRule | ConditionalLogic | null
): conditionalOn is ConditionalLogic {
  return conditionalOn !== null && 'operator' in conditionalOn && 'conditions' in conditionalOn;
}

// Helper to check if conditionalOn is a single condition (legacy format)
export function isConditionalRule(
  conditionalOn: ConditionalRule | ConditionalLogic | null
): conditionalOn is ConditionalRule {
  return conditionalOn !== null && 'questionId' in conditionalOn && !('operator' in conditionalOn);
}
