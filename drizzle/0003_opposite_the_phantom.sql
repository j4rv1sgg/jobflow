ALTER TABLE "documents" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "extracted_text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "document_title" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "file_path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "file_url";