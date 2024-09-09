ALTER TABLE "team_member_roles" RENAME COLUMN "team_id" TO "team_member_id";--> statement-breakpoint
ALTER TABLE "team_member_roles" DROP CONSTRAINT "team_member_roles_team_id_team_members_team_id_fk";
--> statement-breakpoint
ALTER TABLE "team_member_roles" DROP CONSTRAINT "team_member_roles_user_id_team_members_user_id_fk";
--> statement-breakpoint
ALTER TABLE "team_member_roles" DROP CONSTRAINT "team_member_roles_team_id_user_id_team_members_team_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "team_member_roles" DROP CONSTRAINT "team_member_roles_team_id_user_id_role_id_pk";--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_team_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "team_member_roles" ADD CONSTRAINT "team_member_roles_team_member_id_role_id_pk" PRIMARY KEY("team_member_id","role_id");--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_member_roles" ADD CONSTRAINT "team_member_roles_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "team_member_roles" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "team_member_roles" ADD CONSTRAINT "team_member_roles_team_member_id_role_id_unique" UNIQUE("team_member_id","role_id");--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_user_id_unique" UNIQUE("team_id","user_id");