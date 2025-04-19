'use server';

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import prisma from '../prisma';

export async function updateUser(formData: FormData) {
  const user = await getSession();
  if (!user) return;

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const isWorking = formData.get('isWorking') === 'true';

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      email,
      isWorking,
    },
  });

  revalidatePath('/configuracoes');
}
