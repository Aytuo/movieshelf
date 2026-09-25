'use server';

import { auth } from '@/lib/auth';
import { requireSession } from '@/lib/auth/require-session';
import { passwordSchema } from '@/lib/validations/auth';
import { headers } from 'next/headers';

export type PasswordActionResult = {
  success: boolean;
  message?: string;
};

export async function setPasswordAction(
  newPassword: string
): Promise<PasswordActionResult> {
  await requireSession();

  const parsed = passwordSchema.safeParse(newPassword);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid password.',
    };
  }

  try {
    await auth.api.setPassword({
      body: {
        newPassword: parsed.data,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: 'Your password has been set.',
    };
  } catch {
    return {
      success: false,
      message: "We couldn't set your password. Please try again.",
    };
  }
}
