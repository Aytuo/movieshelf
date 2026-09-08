import { db } from '@/lib/db';
import { media, post, profile } from '@/lib/db/schema';
import type { Post } from '@/types';
import { desc, eq } from 'drizzle-orm';

type DbPost = typeof post.$inferSelect;
type DbMedia = typeof media.$inferSelect;
type DbProfile = typeof profile.$inferSelect;

type PostRow = {
  post: DbPost;
  media: DbMedia;
  profile: DbProfile;
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
  limit = 20
): Promise<Post[]> {
  const rows = await db
    .select({
      post,
      media,
      profile,
    })
    .from(post)
    .innerJoin(media, eq(media.id, post.mediaId))
    .innerJoin(profile, eq(profile.userId, post.authorId))
    .where(eq(post.mediaId, mediaId))
    .orderBy(desc(post.createdAt))
    .limit(limit);

  return rows.map(mapPost);
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
