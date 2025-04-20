"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { CalendarIcon, Upload, X } from "lucide-react";
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
import { createEvent } from "@/lib/actions/create-event";

// Limite máximo de upload de imagem: 32MB
const MAX_FILE_SIZE = 32 * 1024 * 1024;

export default function NovoEventoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!fileInputRef.current) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Imagem muito grande. Máximo 32MB.");
        return;
      }
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Imagem muito grande. Máximo 32MB.");
        e.target.value = "";
        return;
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validação de campos obrigatórios
    const requiredFields = [
      { name: "title", label: "Título" },
      { name: "category", label: "Categoria Principal" },
      { name: "description", label: "Descrição Curta" },
      { name: "longDescription", label: "Descrição Completa" },
      { name: "time", label: "Horário" },
      { name: "location", label: "Local" },
      { name: "prize", label: "Premiação" },
      { name: "contact", label: "Contato" },
      { name: "urlEvento", label: "Site to evento" },
    ];
    for (const field of requiredFields) {
      const value = formData.get(field.name);
      if (!value || !value.toString().trim()) {
        toast.error(`O campo ${field.label} é obrigatório.`);
        setIsSubmitting(false);
        return;
      }
    }
    if (!date) {
      toast.error("Selecione a data do evento.");
      setIsSubmitting(false);
      return;
    }
    formData.set("date", date.toISOString());

    const file = fileInputRef.current?.files?.[0] || null;
    if (!file) {
      toast.error("Selecione uma imagem para o evento.");
      setIsSubmitting(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        formData.set("imageBase64", base64);
        formData.delete("image");

        await createEvent(formData);
        toast.success("Evento criado com sucesso!");
        router.push("/admin/eventos/pendentes");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar evento. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Evento</h1>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Informações do Evento</CardTitle>
          <CardDescription>
            Preencha todos os campos para enviar o evento.
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
              />
            </div>

            {/* Categorias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria Principal</Label>
                <Select name="category">
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cft">CFT</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="ia">IA</SelectItem>
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
                    <SelectItem value="ia">IA</SelectItem>
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
                placeholder="Breve descrição"
                className="bg-gray-700 border-gray-600"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longDescription">Descrição Completa</Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                placeholder="Detalhes, regras, objetivos"
                className="bg-gray-700 border-gray-600"
                rows={6}
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
                        !date && "text-muted-foreground",
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prize">Premiação</Label>
                <Input
                  id="prize"
                  name="prize"
                  placeholder="Ex: R$ 25.000"
                  className="bg-gray-700 border-gray-600"
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
              />
            </div>
            {/* url do evento */}
            <div className="space-y-2">
              <Label htmlFor="urlEvento">Site to evento</Label>
              <Input
                id="urlEvento"
                name="urlEvento"
                placeholder="https://site-evento.com"
                className="bg-gray-700 border-gray-600"
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
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700/50 transition-colors"
              >
                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview da imagem"
                      className="mx-auto max-h-48 rounded object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">
                      Clique, arraste ou solte uma imagem (≤32MB)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG ou WEBP
                    </p>
                  </>
                )}
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
    </div>
  );
}
