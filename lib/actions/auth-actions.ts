"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { login, register as registerUser, logout as logoutUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  confirmPassword: z.string().min(6),
});

export type FormState = {
  error: string;
  success: boolean;
};

export async function registerAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message, success: false };
  }

  const { name, email, password, confirmPassword } = parsed.data;
  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem", success: false };
  }

  try {
    const result = await registerUser(name, email, password);
    if ("error" in result) {
      return { error: result.error, success: false };
    }

    redirect("/login");
    return { error: "", success: true };
  } catch (err) {
    console.error("Erro no registerAction:", err);
    return { error: "Erro ao cadastrar usuário", success: false };
  }
}

export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<{ error: string } | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) return { error: "Credenciais inválidas" };

  try {
    const user = await login(email, password);
    if (!user) return { error: "Email ou senha incorretos" };

    revalidatePath("/");
    redirect("/");
  } catch {
    return { error: "Ocorreu um erro ao fazer login" };
  }
}

export async function logoutAction(): Promise<void> {
  await logoutUser();
  revalidatePath("/");
  redirect("/login");
}
