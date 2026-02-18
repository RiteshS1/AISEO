import { z } from 'zod';

export const auditInputsSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  industry: z.string().min(1, 'Industry is required'),
  websiteUrl: z.string().min(1, 'Website URL is required'),
  keywords: z.string(),
  location: z.string(),
  serviceCategories: z.string(),
});

export type AuditInputs = z.infer<typeof auditInputsSchema>;
