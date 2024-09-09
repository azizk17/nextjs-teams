ALTER TABLE "teams" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "user_roles" ADD COLUMN "assigned_at" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_member_roles" ADD CONSTRAINT "team_member_roles_team_id_user_id_team_members_team_id_user_id_fk" FOREIGN KEY ("team_id","user_id") REFERENCES "public"."team_members"("team_id","user_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
