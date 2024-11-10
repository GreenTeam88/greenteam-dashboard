import { z } from 'zod';

export const projectCreateFormSchema = z.object({
  quotation: z.string().optional(),
  projectNumber: z.string().optional(),
  client: z.string().min(1, { message: 'Client is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  projectName: z.string().min(1, { message: 'Project name is required' }),
  clientPreferences: z.string().min(1, { message: 'Client preference is required' }),
  houseParts: z.string().array().nonempty({ message: 'House parts is required' }),
  floorNumber: z.number().positive({ message: 'Floor number should be a positive number' }).optional(),
  projectDateStart: z.date().optional(),
  projectDateEnd: z.date().optional(),
  subcontractor: z.string().optional(),
  address: z.string(),
  city: z.string(),
  clientReference: z.string(),
  details: z.string().min(1, { message: 'Details is required' }),
  files: z.any(),
});
