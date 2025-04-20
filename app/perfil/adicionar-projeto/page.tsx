"use client";

import { createProject } from "@/lib/actions/create-project";

import React, { useState, useRef, useEffect, useActionState } from "react";
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

const initialState = null;
export default function NovoEventoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState<Date>();

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const removeImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
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
      const base64 = await convertToBase64(file);
      setImageBase64(base64);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Imagem muito grande. Máximo 32MB.");
        e.target.value = "";
        return;
      }
      setPreview(URL.createObjectURL(file));
      const base64 = await convertToBase64(file);
      setImageBase64(base64);
    }
  };
  const [state, formAction] = useActionState(createProject, initialState);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Adicionar projeto</h1>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Informações do projeto</CardTitle>
          <CardDescription>
            Preencha os detalhes do seu projeto.{" "}
            <b>mostre para o mundo oque vc é capaz de fazer</b>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Titulo */}
            <div className="space-y-2">
              <Label htmlFor="title">Título do projeto</Label>
              <Input
                id="title"
                name="title"
                placeholder="AI para analise de blockchain"
                className="bg-gray-700 border-gray-600"
              />
            </div>

            {/* URL do projeto */}
            <div className="space-y-2">
              <Label htmlFor="award">Onde podemos encontrar o projeto? </Label>
              <Input
                id="url"
                name="url"
                placeholder="url do projeto: https://github.com"
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>

            {/* Evento vinculado  */}
            <div className="space-y-2">
              <Label htmlFor="eventId">
                Esta vinculado em qual evento (opcional)
              </Label>
              <Input
                id="eventId"
                name="eventId"
                placeholder="ID do evento"
                className="bg-gray-700 border-gray-600"
              />
            </div>

            {/* Colocação */}
            <div className="space-y-2">
              <Label htmlFor="award">Qual foi a sua colocação (opcional)</Label>
              <Input
                id="award"
                name="award"
                placeholder="Participante"
                className="bg-gray-700 border-gray-600"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Breve descrição"
                className="bg-gray-700 border-gray-600"
                rows={4}
              />
            </div>

            {/* Campo oculto que ira passar a imagem como base64 para a action */}
            {imageBase64 && (
              <input type="hidden" name="imageBase64" value={imageBase64} />
            )}

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
                {isSubmitting ? "Adicionando..." : "Adicionar evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/*
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validação de campos obrigatórios
    const requiredFields = [
      { name: "title", label: "Título" },
      { name: "url", label: "Onde podemos encontrar o projeto?" },
    ];
    for (const field of requiredFields) {
      const value = formData.get(field.name);
      if (!value || !value.toString().trim()) {
        toast.error(`O campo ${field.label} é obrigatório.`);
        setIsSubmitting(false);
        return;
      }
    }
    const file = fileInputRef.current?.files?.[0] || null;
    if (!file) {
      toast.error("Selecione uma imagem para o projeto.");
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
  */

//
// export default function NovoEventoPage() {
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//
//   const [date, setDate] = useState<Date>();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//
//   const [state, formAction] = useActionState(createProject, initialState);
//
//   const [preview, setPreview] = useState<string | null>(null);
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//
//     if (file) {
//       if (file.size > MAX_FILE_SIZE) {
//         toast.error("Imagem muito grande. Máximo 32MB.");
//         e.target.value = "";
//         return;
//       }
//       setPreview(URL.createObjectURL(file));
//     }
//   };
//
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (!fileInputRef.current) return;
//     const file = e.dataTransfer.files?.[0];
//     if (file) {
//       if (file.size > MAX_FILE_SIZE) {
//         toast.error("Imagem muito grande. Máximo 32MB.");
//         return;
//       }
//       const dt = new DataTransfer();
//       dt.items.add(file);
//       fileInputRef.current.files = dt.files;
//       setPreview(URL.createObjectURL(file));
//     }
//   };
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!fileInputRef.current) return;
//     setIsSubmitting(true);
//
//     const formData = new FormData(e.currentTarget);
//
//     // converte data do calendário
//
//     // pega o File do input
//     const file = (fileInputRef.current.files?.[0] as File) || null;
//     if (!file) {
//       alert("Por favor, selecione uma imagem");
//       setIsSubmitting(false);
//       return;
//     }
//
//     // converte File → Base64
//     const reader = new FileReader();
//     reader.onload = async () => {
//       const base64 = reader.result as string;
//       formData.set("imageBase64", base64);
//       formData.delete("image"); // remove o File cru, só enviamos o Base64
//
//       try {
//         await createEvent(formData);
//         setSuccess(true);
//         setTimeout(() => {
//           router.push("/admin/eventos/pendentes");
//         }, 2000);
//       } catch (err) {
//         console.error(err);
//         alert("Erro ao criar evento");
//       } finally {
//         setIsSubmitting(false);
//       }
//     };
//     reader.readAsDataURL(file);
//   };
//
//   return (
//     <div className="max-w-4xl mx-auto">
//               {/* Id do projeto */}
//               {/* Upload de Imagem */}
//               {/* Upload de Imagem */}
//               <div className="space-y-2">
//                 <Label htmlFor="image">Imagem do Evento</Label>
//                 <input
//                   ref={fileInputRef}
//                   id="image"
//                   name="image"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 <div
//                   onClick={() => fileInputRef.current?.click()}
//                   onDragOver={(e) => e.preventDefault()}
//                   onDrop={handleDrop}
//                   className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700/50 transition-colors"
//                 >
//                   {preview ? (
//                     <div className="relative inline-block">
//                       <img
//                         src={preview}
//                         alt="Preview da imagem"
//                         className="mx-auto max-h-48 rounded object-contain"
//                       />
//                       <button
//                         type="button"
//                         onClick={removeImage}
//                         className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
//                       <p className="text-sm text-gray-400">
//                         Clique, arraste ou solte uma imagem (≤32MB)
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         PNG, JPG ou WEBP
//                       </p>
//                     </>
//                   )}
//                 </div>
//               </div>
//
//               {/* Botões */}
//               <div className="flex justify-end gap-3">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.back()}
//                 >
//                   Cancelar
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="bg-orange-500 hover:bg-orange-600"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Adicionando..." : "Adicionar projeto"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
