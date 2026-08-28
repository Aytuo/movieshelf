import { relations } from 'drizzle-orm';
import { account, session, user } from './auth';
import { media } from './media';
import { mediaInteraction } from './media-interaction';
import { profile } from './profile';
import { comment, post, reaction, review } from './social';
import { watchHistory } from './watch-history';

/* ========================================================================== */
/*                               RELATIONS: USER                              */
/* ========================================================================== */

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile),
  sessions: many(session),
  accounts: many(account),
  mediaInteractions: many(mediaInteraction),
  reviews: many(review),
  watchHistory: many(watchHistory),
  posts: many(post),
  comments: many(comment),
  reactions: many(reaction),
}));

/* ========================================================================== */
/*                             RELATIONS: SESSION                             */
/* ========================================================================== */

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

/* ========================================================================== */
/*                             RELATIONS: ACCOUNT                             */
/* ========================================================================== */

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

/* ========================================================================== */
/*                              RELATIONS: MEDIA                              */
/* ========================================================================== */

export const mediaRelations = relations(media, ({ many }) => ({
  interactions: many(mediaInteraction),
  reviews: many(review),
  watchHistory: many(watchHistory),
  posts: many(post),
}));

/* ========================================================================== */
/*                        RELATIONS: MEDIA INTERACTION                        */
/* ========================================================================== */

export const mediaInteractionRelations = relations(
  mediaInteraction,
  ({ one }) => ({
    user: one(user, {
      fields: [mediaInteraction.userId],
      references: [user.id],
    }),

    media: one(media, {
      fields: [mediaInteraction.mediaId],
      references: [media.id],
    }),
  })
);

/* ========================================================================== */
/*                              RELATIONS: REVIEW                             */
/* ========================================================================== */

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, { fields: [review.userId], references: [user.id] }),

  media: one(media, { fields: [review.mediaId], references: [media.id] }),
}));

/* ========================================================================== */
/*                          RELATIONS: WATCH HISTORY                          */
/* ========================================================================== */

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  user: one(user, { fields: [watchHistory.userId], references: [user.id] }),

  media: one(media, { fields: [watchHistory.mediaId], references: [media.id] }),
}));

/* ========================================================================== */
/*                               RELATIONS: POST                              */
/* ========================================================================== */

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),

  media: one(media, { fields: [post.mediaId], references: [media.id] }),

  comments: many(comment),

  reactions: many(reaction),
}));

/* ========================================================================== */
/*                              RELATIONS: COMMENT                            */
/* ========================================================================== */

export const commentRelations = relations(comment, ({ one, many }) => ({
  author: one(user, { fields: [comment.authorId], references: [user.id] }),

  post: one(post, { fields: [comment.postId], references: [post.id] }),

  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
    relationName: 'commentReplies',
  }),

  replies: many(comment, { relationName: 'commentReplies' }),
}));

/* ========================================================================== */
/*                             RELATIONS: REACTION                            */
/* ========================================================================== */

export const reactionRelations = relations(reaction, ({ one }) => ({
  user: one(user, { fields: [reaction.userId], references: [user.id] }),

  post: one(post, { fields: [reaction.postId], references: [post.id] }),
}));
