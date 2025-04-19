import EventCard from "@/components/event-card"
import TeamMember from "@/components/team-member"
import HeroCarousel from "@/components/hero-carousel"
import prisma from "@/lib/prisma"
import Image from "next/image"

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
      name: "Fábio Brasileiro",
      role: "Desenvolvedor do projeto",
      image: "/founder/fabiobrasileiro.jpeg",
    },
  ]

  // Dados simulados para o carrossel
  const carouselItems = [
    {
      id: 1,
      title: "Nossa Proposta",
      description:
        "A CowWorking conecta talentos, organizações e investidores por meio de uma plataforma inteligente e gamificada, transformando competições de tecnologia, empreendedorismo e inovação em ecossistemas organizados, inclusivos e lucrativos. Nossa solução utiliza IA e Machine Learning para recomendação de talentos e análises personalizadas, além de gamificação para engajamento e blockchain para garantir transparência nos resultados.",
      isView: false,
      link: "https://chat.whatsapp.com/D0dLMKIiY2gEB8xxDIjDnQ",
      descriptionLink: "Entre no nosso grupo",
      image: "/banner/cww.png",
    },
    {
      id: 2,
      title: "Hackathon de IA",
      description:
        "Participe do maior evento de inteligência artificial do Brasil. Venha desenvolver soluções inovadoras e concorrer a prêmios incríveis.",
      isView: true,
      image: "/event.jpg",
    },
    {
      id: 3,
      title: "Blockchain Challenge",
      description:
        "Desafie-se no mundo da tecnologia blockchain e crie aplicações descentralizadas que podem revolucionar o mercado.",
      isView: true,
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
          A CowWorking conecta talentos, organizações e investidores por meio de uma plataforma inteligente e gamificada, transformando competições de tecnologia, empreendedorismo e inovação em ecossistemas organizados, inclusivos e lucrativos. Nossa solução utiliza IA e Machine Learning para recomendação de talentos e análises personalizadas, além de gamificação para engajamento e blockchain para garantir transparência nos resultados.
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
          Na CowWorking, promovemos um ambiente colaborativo onde participantes desenvolvem habilidades técnicas e sociais, ampliam sua rede de contatos e validam portfólios com métricas confiáveis. Organizadores contam com automação e insights para otimizar eventos; empresas e instituições acadêmicas têm acesso a talentos qualificados; mentores recebem reconhecimento e visibilidade, fortalecendo o ecossistema de inovação.
        </p>
        <div className="absolute bottom-10 right-10 flex items-center gap-3 max-xl:hidden">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-24 h-24 border-4 border-orange-500 rounded-full">
              <Image src="/cww-logo.svg" width={40} height={40} alt="Logo ouro" />
            </div>
            <span className="text-yellow-400 text-2xl font-bold">Ouro</span>
          </div>
        </div>
      </section>
    </div>
  )
}
