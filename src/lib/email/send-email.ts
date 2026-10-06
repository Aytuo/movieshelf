import 'server-only';

import type { ReactNode } from 'react';
import { Resend } from 'resend';

type SendEmailInput = {
  to: string;
  subject: string;
  react: ReactNode;
  text?: string;
};

export async function sendEmail({
  to,
  subject,
  react,
  text,
}: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY and RESEND_FROM_EMAIL must be configured.');
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    react,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}
