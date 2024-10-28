import { z } from 'zod';

export const clientCreateFormSchema = z
  .object({
    clientType: z.enum(['Private', 'Business Client']),
    firstName: z.string().min(1, { message: 'First Name is required' }).max(255).optional(),
    lastName: z.string().min(1, { message: 'Last Name is required' }).max(255).optional(),
    clientNumber: z.string().optional(), // to be changed later
    companyName: z.string().min(1, { message: 'Company Name is required' }).max(255).optional(),
    address: z.string().min(1, { message: 'Address is required' }).max(255).optional(),
    businessAddress: z.string().min(1, { message: 'Business Address is required' }).max(255).optional(),
    houseNumber: z.string().min(1, { message: 'House Number is required' }).max(255).optional(),
    cocNumber: z.string().min(1, { message: 'Chamber of Commerce Number is required' }).max(255).optional(),
    vatTaxNumber: z.string().min(1, { message: 'VAT Tax Number is required' }).max(255).optional(),
    extraAddressInfo: z.string().max(255).optional(),
    extraBusinessAddressInfo: z.string().max(255).optional(),
    postalCode: z.string().min(1, { message: 'Postal Code is required' }).max(255),
    city: z.string().min(1, { message: 'City is required' }).max(255),
    country: z.string().min(1, { message: 'Country is required' }).max(255),
    preferredLanguage: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }),
    telephone1: z.string().min(1, { message: 'Telephone1 is required' }).max(255),
    telephone2: z.string().min(1, { message: 'Telephone2 is required' }).max(255),
  })
  .superRefine((data, ctx) => {
    if (data.clientType === 'Private') {
      // Private client-specific validations
      if (!data.firstName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'First Name is required for Private clients',
          path: ['firstName'],
        });
      }
      if (!data.lastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Last Name is required for Private clients',
          path: ['lastName'],
        });
      }
      if (!data.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Address is required for Private clients',
          path: ['address'],
        });
      }
      if (!data.houseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'House Number is required for Private clients',
          path: ['houseNumber'],
        });
      }
      if (!data.clientNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Client Number is required for Private clients',
          path: ['clientNumber'],
        });
      }
    } else if (data.clientType === 'Business Client') {
      // Business client-specific validations
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company Name is required for Business clients',
          path: ['companyName'],
        });
      }
      if (!data.businessAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Business Address is required for Business clients',
          path: ['businessAddress'],
        });
      }
      if (!data.cocNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chamber of Commerce Number is required for Business clients',
          path: ['cocNumber'],
        });
      }
      if (!data.vatTaxNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'VAT Tax Number is required for Business clients',
          path: ['vatTaxNumber'],
        });
      }
    }
  });
