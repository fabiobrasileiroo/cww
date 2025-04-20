"use server";

import prisma from "@/lib/prisma";

export async function deleteProjetc(projectId: string) {
  console.log("deleting the project", projectId);
  const deletedProject = await prisma.project.delete({
    where: {
      id: projectId, // Make sure `projectId` is defined and passed
    },
  });

  console.log("Projeto deletado do prisma");
  return { success: true, deletedProject };
}
