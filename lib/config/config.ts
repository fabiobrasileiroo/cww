export const isDev = process.env.NODE_ENV === "development"
export const isHomol = process.env.NODE_ENV === "test"
export const isProd = process.env.NODE_ENV === "production"

// Escolhe o segredo apropriado
const rawJwtSecret =
  isProd ? process.env.JWT_SECRET :
  process.env.JWT_SECRET_DEVELOPMENT
if (!rawJwtSecret) {
  throw new Error("JWT secret is not defined for the current environment.")
}

export const jwtSecret = new TextEncoder().encode(rawJwtSecret)
