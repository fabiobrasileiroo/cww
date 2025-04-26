export const isDev = process.env.NODE_ENV === "development";
export const isHomol = process.env.NODE_ENV === "test";
export const isProd = process.env.NODE_ENV === "production";

// Mesma lógica pro URL do Google
const secret =
  process.env.NODE_ENV === "production"
    ? process.env.JWT_SECRET!
    : process.env.JWT_SECRET_DEVELOPMENT!;

// Pega a URL conforme o ambiente
const rawAppUrlGoogle =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NEXT_PUBLIC_APP_URL_DEVELOPMENT;

// Garante que não é undefined em tempo de compilação e execução
if (!rawAppUrlGoogle) {
  throw new Error(
    "Missing NEXT_PUBLIC_APP_URL (produção) or NEXT_PUBLIC_APP_URL_DEVELOPMENT (dev)."
  );
}

export const appUrlGoogle: string = rawAppUrlGoogle;
export const jwtSecret = new TextEncoder().encode(secret);
