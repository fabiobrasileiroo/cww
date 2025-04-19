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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
      <h1 className="text-3xl font-bold mb-6">Criar Novo Evento</h1>

      {success ? (
        <Alert className="bg-green-900/20 border-green-800 mb-6">
          <AlertTitle>Evento criado com sucesso!</AlertTitle>
          <AlertDescription>
            Seu evento foi enviado para aprovação. Você será redirecionado para a
            página de eventos pendentes.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
            <CardDescription>
              Preencha os detalhes do seu evento. Ele será enviado para aprovação
              antes de ser publicado.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título do Evento</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Hackathon de IA"
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>

              {/* Categorias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria Principal</Label>
                  <Select name="category" required>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cft">CFT</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="ia">Inteligência Artificial</SelectItem>
                      <SelectItem value="web3">Web 3.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondCategory">Categoria Secundária</Label>
                  <Select name="secondCategory">
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cft">CFT</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="ia">Inteligência Artificial</SelectItem>
                      <SelectItem value="web3">Web 3.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Descrições */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição Curta</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Uma breve descrição do evento"
                  className="bg-gray-700 border-gray-600"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longDescription">Descrição Completa</Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  placeholder="Descreva detalhadamente o evento, regras, objetivos, etc."
                  className="bg-gray-700 border-gray-600"
                  rows={6}
                  required
                />
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data do Evento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-700 border-gray-600",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date
                          ? format(date, "PPP", { locale: ptBR })
                          : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Local e Premiação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Ex: São Paulo - SP"
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prize">Premiação</Label>
                  <Input
                    id="prize"
                    name="prize"
                    placeholder="Ex: R$ 25.000"
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-2">
                <Label htmlFor="contact">Contato</Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="Ex: +55 11 99999-9999"
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>

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
