import { Button } from "@/components/ui/button";
import EventCard from "@/components/event-card";
import prisma from "@/lib/prisma";

export default async function EventosPage() {
  // Buscar eventos aprovados do banco de dados
  const events = await prisma.event.findMany({
    where: {
      status: "APPROVED",
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
  });

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Calendário de eventos</h1>
        <div className="flex gap-2">
          <Button variant="outline">Filtrar</Button>
          <Button variant="outline">Ordenar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
