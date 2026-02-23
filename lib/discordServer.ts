export interface ApprovalRequestParams {
  brandName: string;
  email: string;
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
          { name: 'Brand', value: params.brandName, inline: true },
          { name: 'Email', value: params.email, inline: true },
          {
            name: 'AI Overall Score',
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
