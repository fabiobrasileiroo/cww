"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/uploadToFreeImage";
import { constructNow } from "date-fns";

export async function createOpniao(_: any, formData: FormData) {
  console.log("action porjetct");
  const session = await getSession();
  if (!session) {
    return { error: "Você precisa estar logado." };
  }

  // const title = formData.get("title")?.toString();
  // const eventId = formData.get("eventId")?.toString() || null;
  // const description = formData.get("description")?.toString() || null;
  // const award = formData.get("award")?.toString() || null;

  const opniao = formData.get("opniao")?.toString();
  const selo = formData.get("selo")?.toString();
  const eventoId = formData.get("eventoId")?.toString();
  console.log(opniao, selo, eventoId);

  const opiniaoCowworking = await prisma.opiniaoCowworking.create({
    data: {
      opniao: opniao,
      selo: selo,
      eventId: eventoId,
    },
  });

  // return { success: true, project };
  return { success: true };
}
