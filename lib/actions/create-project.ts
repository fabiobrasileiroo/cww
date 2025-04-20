"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/uploadToFreeImage";
import { constructNow } from "date-fns";

export async function createProject(_: any, formData: FormData) {
  console.log("action porjetct");
  const session = await getSession();
  if (!session) {
    return { error: "Você precisa estar logado." };
  }

  const title = formData.get("title")?.toString();
  const url = formData.get("url")?.toString() || null;
  const eventId = formData.get("eventId")?.toString() || null;
  const description = formData.get("description")?.toString() || null;
  const award = formData.get("award")?.toString() || null;

  // console.log(formData);

  let imageBase64 = formData.get("imageBase64") as string;

  if (!imageBase64) {
    throw new Error("A imagem em Base64 não foi enviada.");
  }
  const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (matches) imageBase64 = matches[2];

  // 3. Faz o upload para Imgbb/FreeImage
  const imageUrl = await uploadImage(imageBase64);
  if (!imageUrl) {
    throw new Error("Falha ao enviar a imagem para o serviço de hospedagem.");
  }
  console.log(imageUrl);

  if (!title || title.length < 3) {
    return { error: "O título é obrigatório e precisa ter ao menos 3 letras." };
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      award,
      url,
      eventId,
      image: imageUrl,
      userId: session.id,
    },
  });

  console.log("foi criado o projeto  no prisma");
  return { success: true, project };
}
