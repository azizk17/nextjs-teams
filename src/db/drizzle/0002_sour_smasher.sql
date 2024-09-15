ALTER TABLE "tokens" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "is_invalid" boolean DEFAULT false;