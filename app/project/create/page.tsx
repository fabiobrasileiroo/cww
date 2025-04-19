"use client"

import { useFormState } from "react-dom"
import { createProject } from "@/lib/actions/create-project"

const initialState = null

export default function CreateProjectPage() {
  const [state, formAction] = useFormState(createProject, initialState)

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Novo Projeto</h1>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Descrição</label>
          <textarea
            name="description"
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Premiação (opcional)</label>
          <input
            type="text"
            name="award"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Evento vinculado (opcional)</label>
          <input
            type="text"
            name="eventId"
            placeholder="ID do evento"
            className="w-full p-2 border rounded"
          />
        </div>

        {state?.error && <p className="text-red-600">{state.error}</p>}
        {state?.success && <p className="text-green-600">Projeto criado com sucesso!</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Criar Projeto
        </button>
      </form>
    </div>
  )
}
