CREATE TABLE "movie" (
	"id" text PRIMARY KEY NOT NULL,
	"tmdb_id" integer NOT NULL,
	"title" text NOT NULL,
	"original_title" text NOT NULL,
	"overview" text,
	"poster_path" text,
	"backdrop_path" text,
	"release_date" text,
	"runtime" integer,
	"genres" text[],
	"rating" numeric(3, 1),
	"vote_count" integer,
	"tagline" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "movie_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE "user_movie" (
	"user_id" text NOT NULL,
	"movie_id" text NOT NULL,
	"status" text DEFAULT 'watchlist' NOT NULL,
	"rating" integer,
	"favorite" boolean DEFAULT false NOT NULL,
	"watched_at" timestamp,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_movie_user_id_movie_id_pk" PRIMARY KEY("user_id","movie_id")
);
--> statement-breakpoint
ALTER TABLE "user_movie" ADD CONSTRAINT "user_movie_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_movie" ADD CONSTRAINT "user_movie_movie_id_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movie"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "movie_tmdb_id_idx" ON "movie" USING btree ("tmdb_id");--> statement-breakpoint
CREATE INDEX "user_movie_user_id_idx" ON "user_movie" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_movie_movie_id_idx" ON "user_movie" USING btree ("movie_id");