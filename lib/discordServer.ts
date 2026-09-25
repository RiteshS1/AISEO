export interface ApprovalRequestParams {
  contactName: string;
  brandName: string;
  email: string;
  industry: string;
  websiteUrl: string;
  overallScore: number;
  reviewUrl: string;
}

export async function sendApprovalRequest(
  params: ApprovalRequestParams
): Promise<void> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url || url.length < 10) {
    throw new Error('DISCORD_WEBHOOK_URL is missing or invalid.');
  }

  const body = {
    embeds: [
      {
        title: 'Report approval requested',
        color: 0x57f287,
        fields: [
          { name: 'Name', value: params.contactName, inline: false },
          { name: 'Email', value: params.email, inline: true },
          { name: 'Brand', value: params.brandName, inline: true },
          { name: 'Industry', value: params.industry, inline: true },
          { name: 'Website', value: params.websiteUrl, inline: false },
          {
            name: 'AI Score',
            value: String(params.overallScore),
            inline: true,
          },
          {
            name: 'Review',
            value: `[Open review](${params.reviewUrl})`,
            inline: false,
          },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord webhook failed: ${res.status} ${text}`);
  }
}

export async function sendReviewReady(reportId: string, contactName: string): Promise<void> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url || !siteUrl) {
    throw new Error('Discord notification is not configured.');
  }

  const reviewUrl = `${siteUrl.replace(/\/$/, '')}/admin/review/${reportId}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title: 'Report ready for quality review',
          color: 0x5865f2,
          fields: [
            { name: 'Contact', value: contactName, inline: true },
            { name: 'Review', value: `[Open review](${reviewUrl})`, inline: false },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Discord webhook failed: ${res.status} ${await res.text()}`);
  }
}
