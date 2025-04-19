import UsersTable from "./usersTable"
import { prisma } from "@/lib/prisma"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return <UsersTable users={users} />
}
