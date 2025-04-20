"use client";

import { createProject } from "@/lib/actions/create-project";

import React, { useState, useRef, useEffect, useActionState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { createOpniao } from "./actions/criar-opnicao";

// Limite máximo de upload de imagem: 32MB

const initialState = null;

export default function NovoEventoPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<Date>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Mudar esse para uma  action que ira alterar o perfil
  const [state, formAction] = useActionState(createOpniao, initialState);
  const eventoId = params?.id as string;
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Opinião Cowworking</h1>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          {/* <CardTitle>Suas informações</CardTitle> */}
          <CardDescription>
            Porque os cowworkers devem se inscrever nesse evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="eventoId" value={eventoId} />

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="opniao">Sua opinião sobre o evento</Label>
              <Textarea
                id="opniao"
                name="opniao"
                placeholder="Fale um pouco sobre você"
                className="bg-gray-700 border-gray-600"
                rows={4}
                required
              />
            </div>

            {/* Selo de qualidade */}
            <div className="space-y-2">
              <Label htmlFor="selo">Selo de qualidade Cowworking</Label>
              <Select name="selo">
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OURO">Ouro</SelectItem>
                  <SelectItem value="PRATA">Prata</SelectItem>
                  <SelectItem value="BRONZE">Bronze</SelectItem>
                  <SelectItem value="LATAO">Latão</SelectItem>
                  <SelectItem value="NAO_RECOMENDA">Não Recomenda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Opinando..." : "Opinar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
