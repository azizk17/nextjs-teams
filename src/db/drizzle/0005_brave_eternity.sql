ALTER TABLE "media_categories" RENAME TO "media_topics";--> statement-breakpoint
ALTER TABLE "categories" RENAME TO "topics";--> statement-breakpoint
ALTER TABLE "media_topics" RENAME COLUMN "category_id" TO "topic_id";--> statement-breakpoint
ALTER TABLE "topics" DROP CONSTRAINT "categories_name_unique";--> statement-breakpoint
ALTER TABLE "topics" DROP CONSTRAINT "categories_parent_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "media_topics" DROP CONSTRAINT "media_categories_media_id_media_id_fk";
--> statement-breakpoint
ALTER TABLE "media_topics" DROP CONSTRAINT "media_categories_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "is_archived" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "topics" ADD CONSTRAINT "topics_parent_id_topics_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_topics" ADD CONSTRAINT "media_topics_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_topics" ADD CONSTRAINT "media_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_name_unique" UNIQUE("name");