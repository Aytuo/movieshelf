ALTER TABLE "review" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "rating" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "contains_spoilers" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_rating_range_check" CHECK ("review"."rating" BETWEEN 1 AND 10);