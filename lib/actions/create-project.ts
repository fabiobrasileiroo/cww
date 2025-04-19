"use server"

import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function createProject(_: any, formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: "Você precisa estar logado." }
  }

  const title = formData.get("title")?.toString()
  const description = formData.get("description")?.toString() || null
  const award = formData.get("award")?.toString() || null
  const eventId = formData.get("eventId")?.toString() || null

  if (!title || title.length < 3) {
    return { error: "O título é obrigatório e precisa ter ao menos 3 letras." }
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      award,
      eventId,
      userId: session.id,
    },
  })

  return { success: true, project }
}
