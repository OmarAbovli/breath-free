CREATE TABLE "ai_memory" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"context" text
);
--> statement-breakpoint
CREATE TABLE "cravings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"time" timestamp DEFAULT now(),
	"trigger" text,
	"resolved" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "usage_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"time" timestamp DEFAULT now(),
	"amount" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" integer DEFAULT 1,
	"streak" integer DEFAULT 0,
	"quit_plan" text DEFAULT 'standard',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_memory" ADD CONSTRAINT "ai_memory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cravings" ADD CONSTRAINT "cravings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;