import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { media } from './media';

/* ========================================================================== */
/*                                   ENUMS                                    */
/* ========================================================================== */

export const reactionTypeEnum = pgEnum('reaction_type', ['like']);

/* ========================================================================== */
/*                                   REVIEW                                   */
/* ========================================================================== */

export const review = pgTable(
  'review',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
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
      .references(() => user.id, { onDelete: 'cascade' }),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
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
      .references(() => user.id, { onDelete: 'cascade' }),
    postId: uuid('post_id')
      .notNull()
      .references(() => post.id, { onDelete: 'cascade' }),
    parentId: uuid('parent_id'), // NULL = direct comment on post; Non-NULL = reply to another comment.
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
      .references(() => user.id, { onDelete: 'cascade' }),
    postId: uuid('post_id')
      .notNull()
      .references(() => post.id, { onDelete: 'cascade' }),
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
