import { updateUser } from "@/lib/actions/update-user";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getSession();

  if (!user) return redirect("/login");

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Configurações da conta</h1>
      <form action={updateUser} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            name="name"
            defaultValue={user.name || ""}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={user.email || ""}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        {/* Campo para nova senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
          <input
            type="password"
            name="newPassword"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Digite uma nova senha"
          />
        </div>

        {/* Confirmar nova senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Confirme sua nova senha"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Salvar mudanças
          </button>
          <a
            href="/forgot-password"
            className="text-sm text-primary-500 hover:underline"
          >
            Esqueceu sua senha?
          </a>
        </div>
      </form>
    </main>
  );
}
