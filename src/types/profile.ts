/* ========================================================================== */
/*                                PROFILE                                     */
/* ========================================================================== */

export type Profile = {
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
} | null;
