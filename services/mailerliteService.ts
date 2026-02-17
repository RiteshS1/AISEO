
export interface MailerLiteSubscriber {
  email: string;
  brandName: string;
  industry: string;
  websiteUrl: string;
  keywords: string;
  reportUrl?: string;
}

class MailerLiteService {
  private apiKey: string;
  private baseUrl: string = 'https://connect.mailerlite.com/api';

  constructor() {
    const hardcodedKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNDljNDE2MzdiYTY4MmIzOTBmYjFiYzM4NmMyNGQ3YzgwYzJkMjAwNDNmZmNmYzhmMWM0NzU2OTVkOWU3OWExYzNmY2UzMGJmMDU0MGIwMWYiLCJpYXQiOjE3NzA4MjkwNjYuODMxMjE3LCJuYmYiOjE3NzA4MjkwNjYuODMxMjIsImV4cCI6NDkyNjUwMjY2Ni44MjE5ODIsInN1YiI6IjIxMjU5MDAiLCJzY29wZXMiOltdfQ.p14Ptu92Nsefp9fWtO0oXiK2qHRTd2AvXGLvJVa_ye-GZc7dYq2dir13fUeitLk8zEAY-pfFKEGLWodK8GkS2iuC9NlBOo0_1avwhTz53ivVCn2Wgbyb2J3m9ulXpAbAzJE_yuau5vsi3R68P-onQizXKMCTJ8aOOGS2iH6IbX1eAwFZvUwHfK96tz56VSVvClfbt3j-Oq2ZsRpOC22fvscyKxsEfpuJ6Nx28f-BREqqatmkNVkJaL41g0m-bkXyyjZ6u7BXE_PrNP_iNll9JbE_z3LU8kMz4SG1g_JahFipFzu6H5d037H7ssYlAodhSRy5zSVRo65C_V7j1oJXa9SsaqsQ6thYKuO2WojR5_6qCAQjlvOeGqYn-7o5pls5mRwcm6KA_6ZmEy4Posif-dzu-denICxWYYtvavrQTrmQulajsBlQC4tmLlhkCOAUQI67t6UuqKwQrNgET3bVm_Va0xFvx6pg20GRtzKq_os_rwYRermVbj-jdGFomVG9Lfs7kWTXbniI9d-QiV5cGyTAaeq5db2HoOCEQEEjHRmdJ3YRCudy9OFXH-yzcfEJNg79uXHZuyWLSontGEYsAHOjCrLkmkf6YSUs01vySEXBT7AfroIAXqVuqROTGILg8uf6Bg4s558doKVIsn1Xc7I1lzoRNR93wJkYXKQTRYI';
    this.apiKey = (process.env as any).MAILERLITE_API_KEY || hardcodedKey;
  }

  private truncate(str: string | undefined, limit: number = 1024): string | undefined {
    if (!str) return undefined;
    if (str.length <= limit) return str;
    return str.substring(0, limit);
  }

  async addSubscriber(data: MailerLiteSubscriber): Promise<boolean> {
    if (!this.apiKey || this.apiKey.length < 50) {
      console.warn('MailerLite API Key is missing or invalid. Subscriber sync skipped.');
      return false;
    }

    try {
      // MailerLite has a 1024 char limit on custom fields.
      // Truncating link would break it, but we handle that by sending a shorter "Lead Link" from the component.
      const response = await fetch(`${this.baseUrl}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          email: data.email,
          fields: {
            company: this.truncate(data.brandName, 255),
            industry: this.truncate(data.industry, 255),
            website: this.truncate(data.websiteUrl, 255),
            keywords: this.truncate(data.keywords, 255),
            report_link: this.truncate(data.reportUrl, 1024), 
          },
          status: 'active'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('MailerLite sync failed:', errorData);
        return false;
      }

      console.log('Subscriber synced to MailerLite successfully');
      return true;
    } catch (error) {
      console.error('Error syncing to MailerLite:', error);
      return false;
    }
  }
}

export const mailerliteService = new MailerLiteService();
