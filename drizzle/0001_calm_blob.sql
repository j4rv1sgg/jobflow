ALTER TABLE "jobs" ALTER COLUMN "applied_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "applied_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "updated_at" DROP DEFAULT;