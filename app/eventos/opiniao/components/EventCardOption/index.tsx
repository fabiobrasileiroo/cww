import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Event } from "@prisma/client";

interface EventProps {
  evnet: { title: string; id: string; description: string };
}

export default function EventCardOpnion({ event }: EventProps) {
  const getCategoryColorClass = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-600";
      case "green":
        return "bg-green-600";
      case "blue":
        return "bg-blue-600";
      case "red":
        return "bg-red-600";
      case "teal":
        return "bg-teal-600";
      case "orange":
        return "bg-orange-600";
      case "pink":
        return "bg-pink-600";
      case "yellow":
        return "bg-yellow-600";
      case "emerald":
        return "bg-emerald-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusBadge = () => {
    if (!event.status) return null;

    switch (event.status) {
      case "APPROVED":
        return <Badge className="bg-green-600">Aprovado</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-600">Rejeitado</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="mb-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold">{event.title}</h3>
            {/* {getStatusBadge()} */}
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-4 line-clamp-3">
          {event.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col p-4 pt-0">
        <Link href={`/eventos/${event.id}`} className="w-full">
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            Ver pagina do evento
          </Button>
        </Link>
        <Link href={`/eventos/opiniao/${event.id}`} className="w-full">
          <Button variant="outline" className="w-full  mt-4">
            Adicionar uma opninão
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
