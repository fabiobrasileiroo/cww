import { PrismaClient } from "@prisma/client"
import { isDev } from "./config/config"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: isDev ? ["query", "error", "warn"] : ["error"],
  })

console.log(!isDev)
if (!isDev) globalForPrisma.prisma = prisma

export default prisma
