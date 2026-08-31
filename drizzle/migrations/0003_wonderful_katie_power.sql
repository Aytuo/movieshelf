CREATE TYPE "public"."media_activity_type" AS ENUM('watchlist_added', 'watching_started', 'watched', 'dropped', 'favorite_added', 'favorite_removed', 'rated', 'reviewed', 'shelf_removed');--> statement-breakpoint
CREATE TABLE "media_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"media_id" uuid NOT NULL,
	"type" "media_activity_type" NOT NULL,
	"rating" integer,
	"review_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media_activity" ADD CONSTRAINT "media_activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_activity" ADD CONSTRAINT "media_activity_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_activity" ADD CONSTRAINT "media_activity_review_id_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."review"("id") ON DELETE set null ON UPDATE no action;