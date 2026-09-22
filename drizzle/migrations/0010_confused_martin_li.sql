ALTER TYPE "public"."notification_type" ADD VALUE 'user_follow';--> statement-breakpoint
CREATE TABLE "user_follow" (
	"follower_id" text NOT NULL,
	"following_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_follow_pkey" PRIMARY KEY("follower_id","following_id"),
	CONSTRAINT "user_follow_no_self_check" CHECK ("user_follow"."follower_id" <> "user_follow"."following_id")
);
--> statement-breakpoint
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_following_id_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_follow_follower_created_at_idx" ON "user_follow" USING btree ("follower_id","created_at","following_id");--> statement-breakpoint
CREATE INDEX "user_follow_following_created_at_idx" ON "user_follow" USING btree ("following_id","created_at","follower_id");