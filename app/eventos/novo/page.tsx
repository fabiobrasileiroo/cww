"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Upload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NovoEventoPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulando envio para API
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      // Redirecionar após mostrar mensagem de sucesso
      setTimeout(() => {
        router.push("/admin/eventos/pendentes")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Evento</h1>

      {success ? (
        <Alert className="bg-green-900/20 border-green-800 mb-6">
          <AlertTitle>Evento criado com sucesso!</AlertTitle>
          <AlertDescription>
            Seu evento foi enviado para aprovação. Você será redirecionado para a página de eventos pendentes.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
            <CardDescription>
              Preencha os detalhes do seu evento. Ele será enviado para aprovação antes de ser publicado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Evento</Label>
                <Input id="title" placeholder="Ex: Hackathon de IA" className="bg-gray-700 border-gray-600" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria Principal</Label>
                  <Select>
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
                  <Label htmlFor="secondCategory">Categoria Secundária (opcional)</Label>
                  <Select>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Curta</Label>
                <Textarea
                  id="description"
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
                  placeholder="Descreva detalhadamente o evento, regras, objetivos, etc."
                  className="bg-gray-700 border-gray-600"
                  rows={6}
                  required
                />
              </div>

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
                        {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input id="time" type="time" className="bg-gray-700 border-gray-600" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    placeholder="Ex: São Paulo - SP"
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prize">Premiação</Label>
                  <Input id="prize" placeholder="Ex: R$ 25.000" className="bg-gray-700 border-gray-600" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contato</Label>
                <Input
                  id="contact"
                  placeholder="Ex: +55 11 99999-9999"
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagem do Evento</Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">Clique para fazer upload ou arraste uma imagem</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG ou WEBP (máx. 5MB)</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar para aprovação"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
