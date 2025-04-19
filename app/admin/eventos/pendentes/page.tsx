import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Award } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { ApproveReviewRejectButtons } from "./buttonActionPedentes"

export default async function EventosAprovaPage() {
  // Buscar eventos aprovados do banco de dados
  const pendingEvents = await prisma.event.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      date: "asc",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  const getCategoryColorClass = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-600"
      case "green":
        return "bg-green-600"
      case "blue":
        return "bg-blue-600"
      case "red":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Eventos Pendentes</h1>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Painel</Button>
        </Link>
      </div>

      {pendingEvents.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-400">Não há eventos pendentes para aprovação.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingEvents.map((event) => (
            <Card key={event.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription>
                      Enviado por <span className="font-medium">{event.author.name}</span> em {new Date(event.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </CardDescription>
                  </div>
                  <Badge className={`${getCategoryColorClass(event.categoryColor)}`}>{event.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{event.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-orange-500 h-4 w-4" />
                    <span className="text-sm">{new Date(event.date).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-orange-500 h-4 w-4" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-orange-500 h-4 w-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="text-orange-500 h-4 w-4" />
                    <span className="text-sm">{event.prize}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <ApproveReviewRejectButtons eventId={event.id}/>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
