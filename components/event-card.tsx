import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Event } from "@prisma/client"

interface EventProps {
  event: Event & {
    author?: {
      name: string
    }
  }
}

export default function EventCard({ event }: EventProps) {
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
      case "teal":
        return "bg-teal-600"
      case "orange":
        return "bg-orange-600"
      case "pink":
        return "bg-pink-600"
      case "yellow":
        return "bg-yellow-600"
      case "emerald":
        return "bg-emerald-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusBadge = () => {
    if (!event.status) return null

    switch (event.status) {
      case "APPROVED":
        return <Badge className="bg-green-600">Aprovado</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-600">Pendente</Badge>
      case "REJECTED":
        return <Badge className="bg-red-600">Rejeitado</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold">{event.title}</h3>
            {/* {getStatusBadge()} */}
          </div>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded ${getCategoryColorClass(event.categoryColor)}`}>
              {event.category}
            </span>
            {event.secondCategory && (
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColorClass(event.secondCategoryColor || "")}`}>
                {event.secondCategory}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-4 line-clamp-3">{event.description}</p>
        <div className="text-xs text-gray-400 space-y-1">
          <p>{event.location}</p>
          <p>Premiação: {event.prize}</p>
          <p>Data: {formatDate(event.date)}</p>
          <p>Contato: {event.contact}</p>
          {event.author && <p className="text-gray-500 mt-2">Criado por: {event.author.name}</p>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/eventos/${event.id}`} className="w-full">
          <Button className="w-full bg-orange-500 hover:bg-orange-600">Ler mais</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
