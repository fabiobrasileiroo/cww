import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Award } from "lucide-react"
import Link from "next/link"

export default function EventosPendentesPage() {
  // Dados simulados para eventos pendentes
  const pendingEvents = [
    {
      id: 101,
      title: "Hack-Mogi 2024",
      category: "CFT",
      categoryColor: "purple",
      description:
        "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur.",
      location: "São Paulo - SP",
      date: "15/05/2024",
      time: "09:00 - 18:00",
      prize: "R$ 30.000",
      author: "user123",
      submittedAt: "22/04/2024",
    },
    {
      id: 102,
      title: "AI Challenge",
      category: "IA",
      categoryColor: "blue",
      description: "Evento focado em soluções de inteligência artificial para problemas reais do mercado financeiro.",
      location: "Rio de Janeiro - RJ",
      date: "10/06/2024",
      time: "10:00 - 19:00",
      prize: "R$ 25.000",
      author: "dev_maria",
      submittedAt: "23/04/2024",
    },
    {
      id: 103,
      title: "Blockchain Summit",
      category: "Crypto",
      categoryColor: "green",
      description:
        "Venha desenvolver soluções inovadoras utilizando tecnologia blockchain e concorra a prêmios incríveis.",
      location: "Belo Horizonte - MG",
      date: "05/07/2024",
      time: "08:30 - 17:30",
      prize: "R$ 20.000",
      author: "crypto_dev",
      submittedAt: "24/04/2024",
    },
  ]

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
                      Enviado por <span className="font-medium">{event.author}</span> em {event.submittedAt}
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
                    <span className="text-sm">{event.date}</span>
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
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-950 hover:text-red-400">
                  Rejeitar
                </Button>
                <Link href={`/admin/eventos/${event.id}/revisar`}>
                  <Button variant="outline">Revisar</Button>
                </Link>
                <Button className="bg-green-600 hover:bg-green-700">Aprovar</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
