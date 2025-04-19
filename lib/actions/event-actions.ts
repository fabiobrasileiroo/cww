"use server"

import { revalidatePath } from "next/cache"
import { requireAuth, requireAdmin } from "@/lib/auth"
import { slugify } from "@/lib/utils"

import prisma from "@/lib/prisma"
import { EventStatus } from "@prisma/client"

import { randomUUID } from "crypto"
import { writeFile } from "fs/promises"
import path from "path"

export async function createEvent(prevState: any, formData: FormData) {
  const session = await requireAuth()
  const imageUrl = formData.get("image") as File
  const buffer = Buffer.from(await imageUrl.arrayBuffer())

  const filename = `${randomUUID()}-${imageUrl.name.replace(/\s/g, "-")}`
  const filepath = path.join(process.cwd(), "public/uploads", filename)
  await writeFile(filepath, buffer)


  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const longDescription = formData.get("longDescription") as string
  const location = formData.get("location") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const contact = formData.get("contact") as string
  const prize = formData.get("prize") as string
  const category = formData.get("category") as string
  const categoryColor = getCategoryColor(category)
  const secondCategory = formData.get("secondCategory") as string
  const secondCategoryColor = secondCategory ? getCategoryColor(secondCategory) : null
  const image = (`/uploads/${filename}`) || "/placeholder.svg"

  if (!title || !description || !location || !date || !time || !contact || !prize || !category) {
    return {
      error: "Todos os campos obrigatórios devem ser preenchidos",
    }
  }

  try {
    const slug = slugify(title)

    // Verificar se já existe um evento com o mesmo slug
    const existingEvent = await prisma.event.findUnique({
      where: {
        slug,
      },
    })

    if (existingEvent) {
      return {
        error: "Já existe um evento com este título",
      }
    }

    // Criar o evento
    await prisma.event.create({
      data: {
        title,
        slug,
        description,
        longDescription,
        location,
        date: new Date(date),
        time,
        contact,
        prize,
        image: imageUrl,
        category,
        categoryColor,
        secondCategory: secondCategory || null,
        secondCategoryColor,
        status: EventStatus.PENDING,
        author: {
          connect: {
            id: session.id,
          },
        },
      },
    })

    revalidatePath("/eventos")
    revalidatePath("/meus-eventos")

    if (session.role === "ADMIN" || session.role === "ROOT") {
      revalidatePath("/admin/eventos/pendentes")
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return {
      error: "Ocorreu um erro ao criar o evento",
    }
  }
}

export async function updateEventStatus(eventId: string, status: EventStatus) {
  const session = await requireAdmin()

  try {
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        status,
      },
    })

    revalidatePath("/eventos")
    revalidatePath("/admin/eventos/pendentes")
    revalidatePath("/admin/eventos/aprovados")
    revalidatePath("/admin/eventos/rejeitados")
    revalidatePath(`/eventos/${eventId}`)

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar status do evento:", error)
    return {
      error: "Ocorreu um erro ao atualizar o status do evento",
    }
  }
}

export async function addComment(prevState: any, formData: FormData) {
  const session = await requireAuth()

  const eventId = formData.get("eventId") as string
  const content = formData.get("content") as string
  const parentId = (formData.get("parentId") as string) || undefined

  if (!content.trim()) {
    return {
      error: "O comentário não pode estar vazio",
    }
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        isReply: !!parentId,
        parentId,
        event: {
          connect: {
            id: eventId,
          },
        },
        author: {
          connect: {
            id: session.id,
          },
        },
      },
    })

    revalidatePath(`/eventos/${eventId}`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error)
    return {
      error: "Ocorreu um erro ao adicionar o comentário",
    }
  }
}

export async function likeComment(commentId: string) {
  const session = await requireAuth()

  try {
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
      include: {
        event: true,
      },
    })

    revalidatePath(`/eventos/${comment.event.id}`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao curtir comentário:", error)
    return {
      error: "Ocorreu um erro ao curtir o comentário",
    }
  }
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    cft: "purple",
    crypto: "green",
    ia: "blue",
    web3: "teal",
    blockchain: "green",
    mobile: "red",
    game: "orange",
    saude: "pink",
    educacao: "yellow",
    sustentabilidade: "emerald",
  }

  return colors[category.toLowerCase()] || "gray"
}

export async function approveEvent(eventId: string) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'APPROVED' },
    });

    revalidatePath('/dashboard/events'); // ou a página onde a lista é exibida
    return { success: true };
  } catch (error) {
    console.error('Erro ao aprovar evento:', error);
    return { success: false, error: 'Erro ao aprovar evento.' };
  }
}

export async function rejectEvent(eventId: string) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'REJECTED' },
    });

    revalidatePath('/dashboard/events'); // ou a página onde a lista é exibida
    return { success: true };
  } catch (error) {
    console.error('Erro ao rejeitar evento:', error);
    return { success: false, error: 'Erro ao rejeitar evento.' };
  }
}

export async function revertEventStatus(eventId: string) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'PENDING' },
    });
    revalidatePath('/dashboard/events');
    return { success: true };
  } catch (error) {
    console.error('Erro ao reverter status do evento:', error);
    return { success: false, error: 'Erro ao reverter status do evento.' };
  }
}
