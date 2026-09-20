CREATE TYPE "public"."notification_type" AS ENUM('post_comment', 'comment_reply', 'post_like', 'comment_like');--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_id" text NOT NULL,
	"actor_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"post_id" uuid,
	"comment_id" uuid,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_id_user_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_recipient_created_at_idx" ON "notification" USING btree ("recipient_id","created_at","id");--> statement-breakpoint
CREATE INDEX "notification_recipient_read_at_idx" ON "notification" USING btree ("recipient_id","read_at");--> statement-breakpoint
CREATE INDEX "notification_actor_idx" ON "notification" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "notification_post_idx" ON "notification" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "notification_comment_idx" ON "notification" USING btree ("comment_id");