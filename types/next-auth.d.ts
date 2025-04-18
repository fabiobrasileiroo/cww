declare module "next-auth" {
  interface User {
    id: string
    role: "USER" | "ADMIN" | "ROOT"
  }

  interface Session {
    user: User
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "USER" | "ADMIN" | "ROOT"
  }
}
