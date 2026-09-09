import { db } from '@/lib/db';
import { media, post, profile } from '@/lib/db/schema';
import type { Post, PostPage, PostPaginationOptions } from '@/types';
import { and, desc, eq, lt, or } from 'drizzle-orm';

const DEFAULT_POST_PAGE_SIZE = 5;
const MAX_POST_PAGE_SIZE = 20;

type DbPost = typeof post.$inferSelect;
type DbMedia = typeof media.$inferSelect;
type DbProfile = typeof profile.$inferSelect;

type PostRow = {
  post: DbPost;
  media: DbMedia;
  profile: DbProfile;
};

type PostCursor = {
  createdAt: string;
  id: string;
};

function mapPost(row: PostRow): Post {
  return {
    id: row.post.id,
    title: row.post.title,
    content: row.post.content,
    createdAt: row.post.createdAt,
    updatedAt: row.post.updatedAt,
    author: {
      userId: row.profile.userId,
      username: row.profile.username,
      displayName: row.profile.displayName,
      avatarUrl: row.profile.avatarUrl,
    },

    media: {
      tmdbId: row.media.tmdbId,
      type: row.media.type,
      title: row.media.title,
      originalTitle: row.media.originalTitle,
      overview: row.media.overview,
      posterPath: row.media.posterPath,
      backdropPath: row.media.backdropPath,
      releaseDate: row.media.releaseDate,
      rating: Number(row.media.tmdbRating ?? 0),
      voteCount: row.media.tmdbVoteCount,
      originalLanguage: row.media.originalLanguage,
      genres: row.media.genres,
    },
  };
}

function encodePostCursor(cursor: PostCursor) {
  return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}

function decodePostCursor(cursor: string): PostCursor | null {
  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
    const parsed = JSON.parse(decoded) as Partial<PostCursor>;

    if (typeof parsed.createdAt !== 'string' || typeof parsed.id !== 'string') {
      return null;
    }

    const date = new Date(parsed.createdAt);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return {
      createdAt: date.toISOString(),
      id: parsed.id,
    };
  } catch {
    return null;
  }
}

export async function createPost(data: {
  authorId: string;
  mediaId: string;
  title: string;
  content: string;
}): Promise<Post | null> {
  const [created] = await db
    .insert(post)
    .values({
      authorId: data.authorId,
      mediaId: data.mediaId,
      title: data.title,
      content: data.content,
    })
    .returning();

  if (!created) {
    return null;
  }

  const [row] = await db
    .select({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
      media,
      profile,
    })
    .from(post)
    .innerJoin(media, eq(media.id, post.mediaId))
    .innerJoin(profile, eq(profile.userId, post.authorId))
    .where(eq(post.id, created.id))
    .limit(1);

  return row ? mapPost(row as PostRow) : null;
}

export async function getMediaPosts(
  mediaId: string,
  options: PostPaginationOptions = {}
): Promise<PostPage> {
  const limit = Math.min(
    Math.max(options.limit ?? DEFAULT_POST_PAGE_SIZE, 1),
    MAX_POST_PAGE_SIZE
  );

  const cursor = options.cursor ? decodePostCursor(options.cursor) : null;

  const rows = await db
    .select({
      post,
      media,
      profile,
    })
    .from(post)
    .innerJoin(media, eq(media.id, post.mediaId))
    .innerJoin(profile, eq(profile.userId, post.authorId))
    .where(
      cursor
        ? and(
            eq(post.mediaId, mediaId),
            or(
              lt(post.createdAt, new Date(cursor.createdAt)),
              and(
                eq(post.createdAt, new Date(cursor.createdAt)),
                lt(post.id, cursor.id)
              )
            )
          )
        : eq(post.mediaId, mediaId)
    )
    .orderBy(desc(post.createdAt), desc(post.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const visibleRows = hasMore ? rows.slice(0, limit) : rows;

  const lastRow = visibleRows.at(-1);

  return {
    posts: visibleRows.map(mapPost),
    nextCursor:
      hasMore && lastRow
        ? encodePostCursor({
            createdAt: lastRow.post.createdAt.toISOString(),
            id: lastRow.post.id,
          })
        : null,
  };
}

export async function getPostById(postId: string): Promise<Post | null> {
  const [row] = await db
    .select({
      post,
      media,
      profile,
    })
    .from(post)
    .innerJoin(media, eq(media.id, post.mediaId))
    .innerJoin(profile, eq(profile.userId, post.authorId))
    .where(eq(post.id, postId))
    .limit(1);

  return row ? mapPost(row) : null;
}
