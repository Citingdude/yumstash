CREATE TABLE "sessions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"secretHash" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "passwordHash" varchar(255);