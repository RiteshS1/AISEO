const MAILERLITE_BASE = 'https://connect.mailerlite.com/api';

function truncate(str: string | undefined, limit: number): string | undefined {
  if (!str) return undefined;
  return str.length <= limit ? str : str.substring(0, limit);
}

export interface MailerLitePayload {
  email: string;
  brandName: string;
  industry: string;
  websiteUrl: string;
  keywords: string;
  reportUrl?: string;
}

export async function addSubscriber(data: MailerLitePayload): Promise<boolean> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey || apiKey.length < 50) {
    console.warn('MAILERLITE_API_KEY is missing or invalid. Subscriber sync skipped.');
    return false;
  }
  const groupId = process.env.MAILERLITE_GROUP_ID;

  try {
    const response = await fetch(`${MAILERLITE_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: data.email,
        fields: {
          company: truncate(data.brandName, 255),
          industry: truncate(data.industry, 255),
          website: truncate(data.websiteUrl, 255),
          keywords: truncate(data.keywords, 255),
          assessment: truncate(data.reportUrl, 1024),
        },
        status: 'active',
        ...(groupId ? { groups: [String(groupId)] } : {}),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('MailerLite sync failed:', errorData);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error syncing to MailerLite:', error);
    return false;
  }
}
