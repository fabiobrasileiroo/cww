import EventCard from "@/components/event-card";
import prisma from "@/lib/prisma";
import EventCardOpnion from "./components/EventCardOption";

export default async function Opinioes() {
  const events = await prisma.event.findMany({
    where: {
      OpiniaoCowworking: null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
    },
  });
  return (
    <div>
      <section>
        <h2 className="text-3xl font-bold mb-8">
          Eventos que precisao de opnião
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCardOpnion key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
