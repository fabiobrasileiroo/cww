"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { CalendarIcon, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { createEvent } from "@/lib/actions/create-event";

export default function NovoEventoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileInputRef.current) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // converte data do calendário
    if (date) {
      formData.set("date", date.toISOString());
    }

    // pega o File do input
    const file = (fileInputRef.current.files?.[0] as File) || null;
    if (!file) {
      alert("Por favor, selecione uma imagem");
      setIsSubmitting(false);
      return;
    }

    // converte File → Base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      formData.set("imageBase64", base64);
      formData.delete("image"); // remove o File cru, só enviamos o Base64

      try {
        await createEvent(formData);
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/eventos/pendentes");
        }, 2000);
      } catch (err) {
        console.error(err);
        alert("Erro ao criar evento");
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Adicionar novo projeto</h1>

      {success ? (
        <Alert className="bg-green-900/20 border-green-800 mb-6">
          <AlertTitle>Projeto criado</AlertTitle>
          <AlertDescription>
            Seu projeto foi adicionado no seu perfil pessoal
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Informações do projeto</CardTitle>
            <CardDescription>
              Preencha os detalhes do seu projeto.{" "}
              <b>mostre para o mundo oque vc é capaz de fazer</b>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titulo */}
              <div className="space-y-2">
                <Label htmlFor="title">Título do projeto</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Tinder de cavalos"
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>

              {/* Para qual evento ele  foi produzido */}
              <div className="space-y-2">
                <Label htmlFor="origem">Hackathon onde ele foi produzido</Label>
                <Input
                  id="origem"
                  name="origem"
                  placeholder="hackathon IBAMA 2023"
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>

              {/* Colocação do projeto */}
              <div className="space-y-2">
                <Label htmlFor="colocacao">
                  Qual foi a colocação final do seu projeto
                </Label>
                <Input
                  id="colocacao"
                  name="colocacao"
                  placeholder="Participante"
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>

              {/* Data e Hora */}

              {/* Local e Premiação */}

              {/* Contato */}

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <Label htmlFor="image">Imagem do Evento</Label>
                <input
                  ref={fileInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700/50 transition-colors"
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    Clique para fazer upload ou arraste uma imagem
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG ou WEBP (máx. 5MB)
                  </p>
                </div>
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
                  {isSubmitting ? "Enviando..." : "Enviar para aprovação"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
