import { Button } from "@/components/ui/button"
import EventCard from "@/components/event-card"

interface SearchPageProps {
  searchParams: { q: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  // Dados simulados para os eventos
  const events = [
    {
      id: 1,
      title: "Hack-Mogi",
      category: "CFT",
      categoryColor: "purple",
      secondCategory: "Crypto",
      secondCategoryColor: "green",
      description:
        "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
      location: "São Paulo - SP",
      date: "25/04/2024",
      contact: "+55 11 99999-9999",
      prize: "R$ 25.250",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Hack-Mogi",
      category: "CFT",
      categoryColor: "purple",
      secondCategory: "Crypto",
      secondCategoryColor: "green",
      description:
        "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
      location: "São Paulo - SP",
      date: "25/04/2024",
      contact: "+55 11 99999-9999",
      prize: "R$ 25.250",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Hack-Mogi",
      category: "CFT",
      categoryColor: "purple",
      secondCategory: "Crypto",
      secondCategoryColor: "green",
      description:
        "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
      location: "São Paulo - SP",
      date: "25/04/2024",
      contact: "+55 11 99999-9999",
      prize: "R$ 25.250",
      image: "/placeholder.svg",
    },
  ]

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resultados para: {query}</h1>
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
  )
}
