ALTER TABLE "media_collections" RENAME TO "media_to_collections";--> statement-breakpoint
ALTER TABLE "media_to_collections" DROP CONSTRAINT "media_collections_media_id_media_id_fk";
--> statement-breakpoint
ALTER TABLE "media_to_collections" DROP CONSTRAINT "media_collections_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "usage_rights" "usage_rights" DEFAULT 'public';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_to_collections" ADD CONSTRAINT "media_to_collections_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_to_collections" ADD CONSTRAINT "media_to_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
