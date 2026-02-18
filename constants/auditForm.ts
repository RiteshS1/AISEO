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
  { name: 'brandName', label: 'Company Name', desc: 'The official name of your business.', placeholder: 'BUSINESS NAME' },
  { name: 'websiteUrl', label: 'Website', desc: 'The main domain of your company.', placeholder: 'WWW.COMPANY.COM' },
  { name: 'industry', label: 'Industry', desc: 'The market category your business belongs to.', placeholder: 'E.G. TECHNOLOGY, SOLAR, FINANCE' },
  { name: 'location', label: 'Service Area', desc: 'The main city or region you serve.', placeholder: 'CITY, STATE, OR COUNTRY' },
  { name: 'serviceCategories', label: 'Services', desc: 'What your business offers to customers.', placeholder: 'E.G. INSTALLATION, CONSULTING' },
  { name: 'keywords', label: 'Top Keywords', desc: 'The main terms you want to be known for.', placeholder: 'E.G. BEST SOLAR INSTALLER' },
];
