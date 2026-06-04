// src/core/db/db.client.ts
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Create the Postgres connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Wrap it in the Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate PrismaClient globally
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;