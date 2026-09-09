DROP INDEX "post_created_at_idx";--> statement-breakpoint
CREATE INDEX "post_media_created_at_id_idx" ON "post" USING btree ("media_id","created_at","id");