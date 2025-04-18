export const isDev = process.env.APP_ENV === "dev"
export const isHomol = process.env.APP_ENV === "homol"
export const isProd = process.env.APP_ENV === "prod"

export const databaseUrl = process.env.DATABASE_URL!
export const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!)
