import EventCard from "@/components/event-card"
import TeamMember from "@/components/team-member"
import HeroCarousel from "@/components/hero-carousel"
import prisma from "@/lib/prisma"

export default async function Home() {
  // Buscar eventos aprovados do banco de dados
  const events = await prisma.event.findMany({
    where: {
      status: "APPROVED",
    },
    take: 6,
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
  console.log("🚀 ~ Home ~ events:", events)

  // events =[
  //   {
  //     id: 1,
  //     title: "Hack-Mogi",
  //     category: "CFT",
  //     categoryColor: "purple",
  //     secondCategory: "Crypto",
  //     secondCategoryColor: "green",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
  //     location: "São Paulo - SP",
  //     date: "25/04/2024",
  //     contact: "+55 11 99999-9999",
  //     prize: "R$ 25.250",
  //     image: "/event-card.jpg",
  //     author: "admin",
  //     status: "approved",
  //   },
  //   {
  //     id: 2,
  //     title: "Hack-Mogi",
  //     category: "CFT",
  //     categoryColor: "purple",
  //     secondCategory: "Crypto",
  //     secondCategoryColor: "green",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
  //     location: "São Paulo - SP",
  //     date: "25/04/2024",
  //     contact: "+55 11 99999-9999",
  //     prize: "R$ 25.250",
  //     image: "/event-card.jpg",
  //     author: "user123",
  //     status: "approved",
  //   },
  //   {
  //     id: 3,
  //     title: "Hack-Mogi",
  //     category: "CFT",
  //     categoryColor: "purple",
  //     secondCategory: "Crypto",
  //     secondCategoryColor: "green",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
  //     location: "São Paulo - SP",
  //     date: "25/04/2024",
  //     contact: "+55 11 99999-9999",
  //     prize: "R$ 25.250",
  //     image: "/event-card.jpg",
  //     author: "user456",
  //     status: "approved",
  //   },
  //   {
  //     id: 4,
  //     title: "Hack-Mogi",
  //     category: "CFT",
  //     categoryColor: "purple",
  //     secondCategory: "Crypto",
  //     secondCategoryColor: "green",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
  //     location: "São Paulo - SP",
  //     date: "25/04/2024",
  //     contact: "+55 11 99999-9999",
  //     prize: "R$ 25.250",
  //     image: "/event-card.jpg",
  //     author: "admin",
  //     status: "approved",
  //   },
  //   {
  //     id: 5,
  //     title: "Hack-Mogi",
  //     category: "CFT",
  //     categoryColor: "purple",
  //     secondCategory: "Crypto",
  //     secondCategoryColor: "green",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
  //     location: "São Paulo - SP",
  //     date: "25/04/2024",
  //     contact: "+55 11 99999-9999",
  //     prize: "R$ 25.250",
  //     image: "/event-card.jpg",
  //     author: "user789",
  //     status: "approved",
  //   },
  //   {
  //     id: 6,
  //     title: "Hack-Mogi",
  //     category: "CFT",
  //     categoryColor: "purple",
  //     secondCategory: "Crypto",
  //     secondCategoryColor: "green",
  //     description:
  //       "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae.",
  //     location: "São Paulo - SP",
  //     date: "25/04/2024",
  //     contact: "+55 11 99999-9999",
  //     prize: "R$ 25.250",
  //     image: "/event-card.jpg",
  //     author: "user123",
  //     status: "approved",
  //   },
  // ]

  // Dados simulados para a equipe
  const teamMembers = [
    {
      id: 1,
      name: "Tarug - Showman",
      role: "CEO",
      image: "/founder/tarug.jpg",
    },
    {
      id: 2,
      name: "Nome Sobrenome",
      role: "CTO",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Nome Sobrenome",
      role: "CFO",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Nome Sobrenome",
      role: "COO",
      image: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Nome Sobrenome",
      role: "CEO",
      image: "/placeholder.svg",
    },
  ]

  // Dados simulados para o carrossel
  const carouselItems = [
    {
      id: 1,
      title: "Titulo Hackathon",
      description:
        "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae. Enim interdum ac lobortis nec in. Arcu nascetur purus vitae at egestas gravida sit tellus. Fermentum convallis vitae id ac. Sem id lacus lacus phasellus tellus dolor. Orci et mi mauris vitae et facilisis.",
      image: "/event.jpg",
    },
    {
      id: 2,
      title: "Hackathon de IA",
      description:
        "Participe do maior evento de inteligência artificial do Brasil. Venha desenvolver soluções inovadoras e concorrer a prêmios incríveis.",
      image: "/event.jpg",
    },
    {
      id: 3,
      title: "Blockchain Challenge",
      description:
        "Desafie-se no mundo da tecnologia blockchain e crie aplicações descentralizadas que podem revolucionar o mercado.",
      image: "/event.jpg",
    },
  ]


  return (
    <div className="space-y-16">
      {/* Hero Section com Carrossel */}
      <HeroCarousel items={carouselItems} />

      {/* Seção de Eventos */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Eventos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Seção Sobre Nós */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Sobre Nós</h2>
        <p className="text-gray-300 mb-10">
          Lorem ipsum dolor sit amet consectetur. Non morbi diam lacus sit volutpat dictum. Nam lectus magna diam ipsum
          dictumst id dictumst facilisis neque. Mauris blandit viverra tempor nulla at a netus nis. Pellentesque purus
          varius ut tristique dignissim. Ut pulvinar et ullamcorper aliquam donec mattis. Molestie volutpat integer
          venenatis volutpate ornare lorem volutpat purus. Rutrum nisi tincidium purus blandit orci nibh eu vel. Libero
          id mauris sed sed suspendisse id. Pretium lectus amet volutpat massa sit consectetur sem facilisis. Id et
          porttitor eleifend praesent facilisi vestibulum condimentum. Purus pellentesque in sem nibh. Feugiat libero
          fusce fames dui vel habitant vulputate. Scelerisque faucibus sapien metus et sed.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {teamMembers.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Seção Opinião Coworking */}
      <section className="relative py-10 px-6 rounded-lg bg-[#1a1a1a]">
        <h2 className="text-3xl font-bold mb-6">Opinião Coworking</h2>
        <p className="text-gray-300 max-w-3xl">
          Lorem ipsum dolor sit amet consectetur. Sit accumsan aliquam feugiat congue posuere sed odio libero. Aliquet
          morbi ultrices felis feugiat curabitur laoreet aenean venenatis nec. Pellentesque vitae ullamcorper sed
          integer quam mauris ipsum sed id. Est leo enim eleifend mauris diam porttitor mauris morbi. Placerat blandit
          ut quisque vitae maecenas nunc. Gravida cras volutpat non consequat a auctor orci. Habitant amet imperdiet sed
          blandit tristique sed non at. Laoreet lectus nibh est fames velit elit laoreet congue. Velit ornare sapien
          porta tincidunt tortor sed. Quis pharetra ut aliquet platea. Porta risus quis nam a lectus dis volutpat.
          Varius bibendum vitae ut sapien volutpat laoreet interdum posuere blandit. Elementum quis molestie feugiat
          velit sed cras condimentum sed. Tincidunt dui facilisi ultricies nec. Nibh tellus imperdiet gravida mauris eu
          eget risus est purus.
        </p>
        <div className="absolute bottom-10 right-10 flex items-center gap-3">
          <div className="text-orange-500 w-12 h-12">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 22H4C3.44772 22 3 21.5523 3 21V15C3 14.4477 3.44772 14 4 14H7C7.55228 14 8 14.4477 8 15V21C8 21.5523 7.55228 22 7 22Z" />
              <path d="M20 22H17C16.4477 22 16 21.5523 16 21V15C16 14.4477 16.4477 14 17 14H20C20.5523 14 21 14.4477 21 15V21C21 21.5523 20.5523 22 20 22Z" />
              <path d="M16.7519 2.99951C17.1476 2.33126 18.0502 2.11343 18.7185 2.50913C19.3868 2.90483 19.6046 3.80745 19.2089 4.4757L11.2089 17.4757C10.8132 18.144 9.91058 18.3618 9.24233 17.9661C8.57408 17.5704 8.35626 16.6678 8.75196 15.9995L16.7519 2.99951Z" />
            </svg>
          </div>
          <span className="text-yellow-400 text-2xl font-bold">Ouro</span>
        </div>
      </section>
    </div>
  )
}
