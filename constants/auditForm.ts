import type { AuditInputs } from '@/lib/schemas/auditInputs';

export const AUDIT_FORM_FIELDS: readonly (keyof AuditInputs)[] = [
  'brandName',
  'websiteUrl',
  'industry',
  'location',
  'serviceCategories',
  'keywords',
] as const;

export const AUDIT_FORM_QUESTIONS: ReadonlyArray<{
  name: keyof AuditInputs;
  label: string;
  desc: string;
  placeholder: string;
}> = [
  { name: 'brandName', label: 'Company Name', desc: 'The official name of your business.', placeholder: 'e.g., Acme Inc' },
  { name: 'websiteUrl', label: 'Website', desc: 'The main domain of your company.', placeholder: 'e.g., www.acme.com' },
  { name: 'industry', label: 'Industry', desc: 'The market category your business belongs to.', placeholder: 'e.g., Technology, Solar, Finance' },
  { name: 'location', label: 'Service Area', desc: 'The main city or region you serve.', placeholder: 'e.g., San Francisco, CA' },
  { name: 'serviceCategories', label: 'Services', desc: 'What your business offers to customers.', placeholder: 'e.g., Installation, Consulting' },
  { name: 'keywords', label: 'Top Keywords', desc: 'The main terms you want to be known for.', placeholder: 'e.g., best solar installer' },
];
