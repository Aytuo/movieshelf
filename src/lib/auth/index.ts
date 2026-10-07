import {
  getPasswordResetEmailText,
  PasswordResetEmail,
  passwordResetEmailSubject,
} from '@/emails/templates/password-reset-email';
import {
  getVerificationEmailText,
  VerificationEmail,
  verificationEmailSubject,
} from '@/emails/templates/verification-email';
import {
  getWelcomeEmailText,
  WelcomeEmail,
  welcomeEmailSubject,
} from '@/emails/templates/welcome-email';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { sendEmail } from '../email/send-email';
import { ensureProfile } from '../services/profile-service';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: passwordResetEmailSubject,
        react: PasswordResetEmail({
          name: user.name,
          url,
        }),
        text: getPasswordResetEmailText({
          name: user.name,
          url,
        }),
      }).catch((error) => {
        console.error('Failed to send password reset email:', error);
      });
    },

    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: verificationEmailSubject,
        react: VerificationEmail({
          name: user.name,
          url,
        }),
        text: getVerificationEmailText({
          name: user.name,
          url,
        }),
      }).catch((error) => {
        console.error('Failed to send verification email:', error);
      });
    },

    afterEmailVerification: async (user) => {
      const url = new URL('/home', process.env.BETTER_AUTH_URL).toString();

      void sendEmail({
        to: user.email,
        subject: welcomeEmailSubject,
        react: WelcomeEmail({
          name: user.name,
          url,
        }),
        text: getWelcomeEmailText({
          name: user.name,
          url,
        }),
      }).catch((error) => {
        console.error('Failed to send welcome email:', error);
      });
    },

    sendOnSignUp: false,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: 'select_account',
      requireEmailVerification: true,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      disableImplicitLinking: false,
      trustedProviders: ['google', 'discord'],
      updateUserInfoOnLink: false,
      allowDifferentEmails: false,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await ensureProfile({
            userId: user.id,
            name: user.name,
            email: user.email,
          });
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [nextCookies()],
});
