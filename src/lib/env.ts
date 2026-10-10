import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL duhet të jetë URL e vlefshme PostgreSQL"),
  APP_SECRET: z.string().min(32, "APP_SECRET duhet të ketë të paktën 32 karaktere"),
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
});

export type Environment = z.infer<typeof environmentSchema>;
export const getEnvironment = (): Environment => environmentSchema.parse({ DATABASE_URL: process.env.DATABASE_URL, APP_SECRET: process.env.APP_SECRET, BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN });
