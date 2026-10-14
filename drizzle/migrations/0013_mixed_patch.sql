ALTER TABLE "comment" DROP CONSTRAINT "comment_author_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "author_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;