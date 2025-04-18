"use server"

import { revalidatePath } from "next/cache"
import { requireAuth, requireRoot } from "@/lib/auth"
import bcrypt from "bcryptjs"

import prisma from "@/lib/prisma"
import type { Role } from "@prisma/client"

export async function updateUserProfile(prevState: any, formData: FormData) {
  const session = await requireAuth()

  const name = formData.get("name") as string
  const image = formData.get("image") as string

  if (!name) {
    return {
      error: "O nome é obrigatório",
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        name,
        image: image || undefined,
      },
    })

    revalidatePath("/perfil")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return {
      error: "Ocorreu um erro ao atualizar seu perfil",
    }
  }
}

export async function changePassword(prevState: any, formData: FormData) {
  const session = await requireAuth()

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      error: "Todos os campos são obrigatórios",
    }
  }

  if (newPassword !== confirmPassword) {
    return {
      error: "As senhas não coincidem",
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        password: true,
      },
    })

    if (!user?.password) {
      return {
        error: "Usuário não possui senha definida",
      }
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return {
        error: "Senha atual incorreta",
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Erro ao alterar senha:", error)
    return {
      error: "Ocorreu um erro ao alterar sua senha",
    }
  }
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await requireRoot()

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    })

    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar papel do usuário:", error)
    return {
      error: "Ocorreu um erro ao atualizar o papel do usuário",
    }
  }
}
