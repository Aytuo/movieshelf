import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
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
  plugins: [nextCookies()],
});
