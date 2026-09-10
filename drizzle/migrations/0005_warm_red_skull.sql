CREATE TABLE "comment_reaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"comment_id" uuid NOT NULL,
	"type" "reaction_type" DEFAULT 'like' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reaction" RENAME TO "post_reaction";--> statement-breakpoint
ALTER TABLE "post_reaction" DROP CONSTRAINT "reaction_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "post_reaction" DROP CONSTRAINT "reaction_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "comment_reaction" ADD CONSTRAINT "comment_reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reaction" ADD CONSTRAINT "comment_reaction_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_comment_reaction_idx" ON "comment_reaction" USING btree ("user_id","comment_id","type");--> statement-breakpoint
CREATE INDEX "comment_reaction_comment_idx" ON "comment_reaction" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX "comment_reaction_user_idx" ON "comment_reaction" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "post_reaction" ADD CONSTRAINT "post_reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_reaction" ADD CONSTRAINT "post_reaction_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;