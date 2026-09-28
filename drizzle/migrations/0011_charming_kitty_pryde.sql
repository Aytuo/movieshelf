ALTER TABLE "profile" ADD COLUMN "avatar_source" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "avatar_provider" text;