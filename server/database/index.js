import { PrismaClient } from './../generated/prisma/index.js';

const globalForPrisma = globalThis;

export const prisma =  new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
