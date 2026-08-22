CREATE TYPE "public"."movie_status" AS ENUM('watchlist', 'watched');--> statement-breakpoint
ALTER TABLE "movie" RENAME COLUMN "rating" TO "tmdb_rating";--> statement-breakpoint
ALTER TABLE "movie" RENAME COLUMN "vote_count" TO "tmdb_vote_count";--> statement-breakpoint
ALTER TABLE "user_movie" ALTER COLUMN "status" SET DEFAULT 'watchlist'::"public"."movie_status";--> statement-breakpoint
ALTER TABLE "user_movie" ALTER COLUMN "status" SET DATA TYPE "public"."movie_status" USING "status"::"public"."movie_status";--> statement-breakpoint
ALTER TABLE "user_movie" ALTER COLUMN "rating" SET DATA TYPE numeric(3, 1);--> statement-breakpoint
ALTER TABLE "user_movie" ADD CONSTRAINT "user_movie_rating_range" CHECK ("user_movie"."rating" IS NULL OR "user_movie"."rating" BETWEEN 1 AND 10);