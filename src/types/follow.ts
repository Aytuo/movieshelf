/* ========================================================================== */
/*                                 FOLLOW                                     */
/* ========================================================================== */

export type FollowStats = {
  followerCount: number;
  followingCount: number;
  viewerIsFollowing: boolean;
};

export type FollowUser = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  viewerIsFollowing: boolean;
};

export type FollowUserPage = {
  users: FollowUser[];
  nextCursor: string | null;
  hasMore: boolean;
};
