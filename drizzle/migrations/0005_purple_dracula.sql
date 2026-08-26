CREATE TABLE "watch_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"movie_id" text NOT NULL,
	"watched_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_movie_id_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movie"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "watch_history_user_id_idx" ON "watch_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "watch_history_movie_id_idx" ON "watch_history" USING btree ("movie_id");--> statement-breakpoint
CREATE INDEX "watch_history_user_watched_at_idx" ON "watch_history" USING btree ("user_id","watched_at");