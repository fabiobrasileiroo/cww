import { PrismaClient } from "@prisma/client"
// import { config } from "dotenv"

// config() // carrega as variáveis do .env

// Altere DATABASE_URL com base no ambiente
if (process.env.NODE_ENV === "production") {
  process.env.DATABASE_URL = process.env.DATABASE_URL_PROD
} else {
  process.env.DATABASE_URL = process.env.DATABASE_URL_DEV
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
