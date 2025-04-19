// app/lib/actions/create-event.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/uploadToFreeImage";
import { randomUUID } from "crypto";
import { getSession } from "../auth";
import { slugify } from "../utils";

export async function createEvent(formData: FormData) {
  // 0. pega o usuário autenticado
  const session = await getSession();
  if (!session || !session.id) {
    throw new Error("Usuário não autenticado.");
  }
  const authorId = session.id;


  // 1. Extrai os campos do evento
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const longDescription = formData.get("longDescription") as string;
  const location = formData.get("location") as string;
  const prize = formData.get("prize") as string;
  const contact = formData.get("contact") as string;
  const category = formData.get("category") as string;
  const secondCategory = formData.get("secondCategory") as string | null;
  const dateString = formData.get("date") as string;
  const time = formData.get("time") as string;
  if (!title || !description || !location || !time || !contact || !prize || !category) {
    return {
      error: "Todos os campos obrigatórios devem ser preenchidos",
    }
  }

  // 2. Extrai e limpa a string Base64
  let imageBase64 = formData.get("imageBase64") as string;
  if (!imageBase64) {
    throw new Error("A imagem em Base64 não foi enviada.");
  }
  const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (matches) imageBase64 = matches[2];

  // 3. Faz o upload para Imgbb/FreeImage
  const imageUrl = await uploadImage(imageBase64);
  console.log("🚀 ~ createEvent ~ imageUrl:", imageUrl)
  if (!imageUrl) {
    throw new Error("Falha ao enviar a imagem para o serviço de hospedagem.");
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

    // 4. Persiste no banco via Prisma, usando o userId real
    await prisma.event.create({
      data: {
        title,
        slug: title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, ""),
        description,
        longDescription,
        location,
        prize,
        contact,
        date: new Date(dateString),
        time,
        image: imageUrl,
        category,
        categoryColor: "#FFA500",
        // Se o usuário não selecionar, envie null
        secondCategory: secondCategory || null, secondCategoryColor: "#666666",
        authorId,              // ← aqui: o ID que existe no seu User Table
      },
    });
    console.log("🚀 ~ createEvent ~ prisma:", prisma)

    revalidatePath("/eventos")
    revalidatePath("/meus-eventos")

    // 5. Revalida a página de eventos pendentes
    if (session.role === "ADMIN" || session.role === "ROOT") {
      revalidatePath("/admin/eventos/pendentes")
    }
  } catch (error) {
    console.error("Erro ao criar evento", error)
    return {
      error: "Ocorreu um erro ao criar o evento"
    }
  }
}
