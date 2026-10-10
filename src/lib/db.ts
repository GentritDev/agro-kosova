import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import { getEnvironment } from "@/lib/env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const createClient = () => new PrismaClient({ adapter: new PrismaNeon({ connectionString: getEnvironment().DATABASE_URL }) });
export const prisma = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
