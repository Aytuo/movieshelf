import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/* ========================================================================== */
/*                                  BETTERAUTH                                */
/* ========================================================================== */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

/* ========================================================================== */
/*                                   ENUMS                                    */
/* ========================================================================== */

export const mediaTypeEnum = pgEnum('media_type', ['movie', 'tv', 'episode']);

export const mediaStatusEnum = pgEnum('media_status', [
  'watchlist',
  'watching',
  'watched',
  'dropped',
]);

export const reactionTypeEnum = pgEnum('reaction_type', ['like']);

/* ========================================================================== */
/*                                    MEDIA                                   */
/* ========================================================================== */

export const media = pgTable(
  'media',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    /**
     * ID of the entity in TMDB.
     */
    tmdbId: integer('tmdb_id').notNull(),
    type: mediaTypeEnum('type').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('media_tmdb_type_idx').on(table.tmdbId, table.type)]
);

/* ========================================================================== */
/*                            MEDIA INTERACTION                               */
/* ========================================================================== */

export const mediaInteraction = pgTable(
  'media_interaction',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id, {
        onDelete: 'cascade',
      }),
    status: mediaStatusEnum('status').notNull(),
    /**
     * User rating.
     *
     * NULL = not rated yet.
     */
    rating: integer('rating'),
    favorite: boolean('favorite').default(false).notNull(),
    watchedAt: timestamp('watched_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('user_media_interaction_idx').on(table.userId, table.mediaId),
    check(
      'rating_range_check',
      sql`${table.rating} IS NULL OR ${table.rating} BETWEEN 1 AND 10`
    ),
    index('media_interaction_user_idx').on(table.userId),
    index('media_interaction_media_idx').on(table.mediaId),
  ]
);

/* ========================================================================== */
/*                                   REVIEW                                   */
/* ========================================================================== */

export const review = pgTable(
  'review',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id, {
        onDelete: 'cascade',
      }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('user_media_review_idx').on(table.userId, table.mediaId),
    index('review_media_idx').on(table.mediaId),
    index('review_user_idx').on(table.userId),
  ]
);

/* ========================================================================== */
/*                                    POST                                    */
/* ========================================================================== */

export const post = pgTable(
  'post',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id, {
        onDelete: 'cascade',
      }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('post_media_idx').on(table.mediaId),
    index('post_author_idx').on(table.authorId),
    index('post_created_at_idx').on(table.createdAt),
  ]
);

/* ========================================================================== */
/*                                  COMMENT                                   */
/* ========================================================================== */

export const comment = pgTable(
  'comment',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    postId: uuid('post_id')
      .notNull()
      .references(() => post.id, {
        onDelete: 'cascade',
      }),
    /**
     * NULL = direct comment on post.
     *
     * Non-null = reply to another comment.
     */
    parentId: uuid('parent_id'),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('comment_post_idx').on(table.postId),
    index('comment_author_idx').on(table.authorId),
    index('comment_parent_idx').on(table.parentId),
  ]
);

/* ========================================================================== */
/*                                  REACTION                                  */
/* ========================================================================== */

export const reaction = pgTable(
  'reaction',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    postId: uuid('post_id')
      .notNull()
      .references(() => post.id, {
        onDelete: 'cascade',
      }),
    type: reactionTypeEnum('type').default('like').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('user_post_reaction_idx').on(
      table.userId,
      table.postId,
      table.type
    ),
    index('reaction_post_idx').on(table.postId),
    index('reaction_user_idx').on(table.userId),
  ]
);

/* ========================================================================== */
/*                                  RELATIONS                                 */
/* ========================================================================== */

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  mediaInteractions: many(mediaInteraction),
  reviews: many(review),
  posts: many(post),
  comments: many(comment),
  reactions: many(reaction),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const mediaRelations = relations(media, ({ many }) => ({
  interactions: many(mediaInteraction),
  reviews: many(review),
  posts: many(post),
}));

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

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),

  media: one(media, {
    fields: [review.mediaId],
    references: [media.id],
  }),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),

  media: one(media, {
    fields: [post.mediaId],
    references: [media.id],
  }),

  comments: many(comment),
  reactions: many(reaction),
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
  author: one(user, {
    fields: [comment.authorId],
    references: [user.id],
  }),

  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),

  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
    relationName: 'commentReplies',
  }),

  replies: many(comment, {
    relationName: 'commentReplies',
  }),
}));

export const reactionRelations = relations(reaction, ({ one }) => ({
  user: one(user, {
    fields: [reaction.userId],
    references: [user.id],
  }),

  post: one(post, {
    fields: [reaction.postId],
    references: [post.id],
  }),
}));
