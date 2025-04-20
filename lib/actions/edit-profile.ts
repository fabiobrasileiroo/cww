"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/uploadToFreeImage";
import { updateUser } from "./update-user";
import { link } from "fs";

// Aqui provavelmente vai ter um idor
export async function editProfile(_: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Você precisa estar logado." };
  }

  console.log(session?.id);

  console.log(formData);

  const name = formData.get("nickname")?.toString();
  const description = formData.get("description")?.toString() || null;
  let github = formData.get("github")?.toString() || null;
  let linkedin = formData.get("linkedin")?.toString() || null;

  // cria a string de social medias
  let socialMedias = [];

  if (github != null && github.trim() != "")
    socialMedias.push({ nome: "github", link: github });
  if (linkedin != null && linkedin.trim() != "")
    socialMedias.push({ nome: "linkedin", link: linkedin });

  let imageBase64 = formData.get("imageBase64") as string;
  //
  if (!imageBase64) {
    throw new Error("A imagem em Base64 não foi enviada.");
  }
  const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (matches) imageBase64 = matches[2];
  //
  // 3. Faz o upload para Imgbb/FreeImage
  const imageUrl = await uploadImage(imageBase64);
  if (!imageUrl) {
    throw new Error("Falha ao enviar a imagem para o serviço de hospedagem.");
  }
  console.log(imageUrl);

  const updatedUser = await prisma.user.update({
    where: {
      id: session.id, // ou outro campo único, como email
    },
    data: {
      name: name,
      image: imageUrl,
      midiasSocias: JSON.stringify(socialMedias),
      descricaoPerfil: description,
    },
  });
  //
  // console.log("foi criado o projeto  no prisma");
  // return { success: true };
  return { success: true, updatedUser };
}
