import EventCard from "@/components/event-card";
import TeamMember from "@/components/team-member";
import HeroCarousel from "@/components/hero-carousel";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Galeria from "./components/Galeria";

export default async function Home() {
  const events = await prisma.event.findMany({
    where: { status: "APPROVED" },
    take: 6,
    orderBy: { date: "asc" },
    include: { author: { select: { name: true } } },
  });

  const teamMembers = [
    {
      id: 1,
      name: "Tarug - Showman",
      role: "CEO",
      image: "/founder/tarug.jpg",
    },
    { id: 2, name: "Nome Sobrenome", role: "CTO", image: "/placeholder.svg" },
    { id: 3, name: "Nome Sobrenome", role: "CFO", image: "/placeholder.svg" },
    { id: 4, name: "Nome Sobrenome", role: "COO", image: "/placeholder.svg" },
    {
      id: 5,
      name: "Fábio Brasileiro",
      role: "Desenvolvedor do projeto",
      image: "/founder/fabiobrasileiro.jpeg",
    },
  ];

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
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section com Carrossel */}
      <HeroCarousel items={carouselItems} />

      {/* Seção de Introdução TEI Sports */}
      <section className="px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">O que são os TEI Sports?</h2>
        <p className="text-gray-300 mb-4">
          TEI Sports significa Esportes de Tecnologia, Empreendedorismo e
          Inovação. São competições modernas onde os "atletas" resolvem
          problemas reais com criatividade, estratégia e ferramentas
          tecnológicas.
        </p>
        <p className="text-gray-300 mb-2 font-semibold">
          Imagine um campeonato onde as habilidades decisivas são:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4">
          <li>Desenvolvimento de software</li>
          <li>Design de soluções</li>
          <li>Modelagem de negócios</li>
          <li>Segurança digital</li>
          <li>Sustentabilidade</li>
        </ul>

        <h3 className="text-xl font-bold mb-2">
          🚀 De onde vêm os TEI Sports?
        </h3>
        <p className="text-gray-300 mb-4">
          Esses desafios evoluíram a partir de eventos como:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4">
          <li>Hackathons (criados nos anos 2000 no Vale do Silício)</li>
          <li>Game Jams (como a Ludum Dare, desde 2002)</li>
          <li>Capture The Flag (CTF) de cibersegurança</li>
          <li>Batalhas de Robôs como a RoboCup</li>
        </ul>
        <p className="text-gray-300 mb-6">
          Hoje, os TEI Sports são porta de entrada para carreiras de inovação.
        </p>

        <h3 className="text-xl font-bold mb-2">
          🧠 Qual é o papel da Cowworking nisso tudo?
        </h3>
        <p className="text-gray-300 mb-4">
          A Cowworking é a primeira e maior comunidade dos TEI Sports no Brasil.
          Ela transforma competições em verdadeiros esportes com estrutura,
          rankings e apoio contínuo.
        </p>
        <p className="text-gray-300 font-semibold mb-2">
          A missão da Cowworking:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4">
          <li>
            Criar um ecossistema colaborativo entre competidores, mentores e
            organizadores
          </li>
          <li>Estabelecer rankings globais de talentos</li>
          <li>
            Apoiar os participantes com visibilidade, prêmios e oportunidades
            reais
          </li>
        </ul>

        <h3 className="text-xl font-bold mb-2">💡 Por que participar?</h3>
        <p className="text-gray-300 font-semibold mb-2">
          Ao entrar nesse ecossistema, você ganha:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4">
          <li>Networking com especialistas e investidores</li>
          <li>Aprendizado prático</li>
          <li>Reconhecimento por performance</li>
          <li>A chance de transformar sua ideia em uma startup</li>
        </ul>

        <h3 className="text-xl font-bold mb-2">📲 Como fazer parte?</h3>
        <ul className="list-disc list-inside text-gray-300 mb-6">
          <li>Participe de hackathons, game jams e desafios abertos</li>
          <li>Entre para a comunidade Cowworking</li>
          <li>Acompanhe o ranking e evolua na jornada da inovação</li>
        </ul>

        <h3 className="text-xl font-bold mb-2">✨ Conclusão</h3>
        <p className="text-gray-300 mb-4">
          Os TEI Sports representam uma nova era de empreendedorismo
          competitivo. A Cowworking é a ponte entre o talento e as oportunidades
          de impacto real.
        </p>
        <p className="text-orange-400 font-bold text-lg">
          Cowworking — onde o sonho é real.
        </p>
      </section>

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
          A CowWorking conecta talentos, organizações e investidores por meio de
          uma plataforma inteligente e gamificada, transformando competições de
          tecnologia, empreendedorismo e inovação em ecossistemas organizados,
          inclusivos e lucrativos. Nossa solução utiliza IA e Machine Learning
          para recomendação de talentos e análises personalizadas, além de
          gamificação para engajamento e blockchain para garantir transparência
          nos resuumalunouninove@gmail.coumalunouninove@gmail.commltados.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {teamMembers.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </section>

      <Galeria />
    </div>
  );
}
