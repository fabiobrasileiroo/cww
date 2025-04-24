import { socialMediasSchema, type SocialMedia as SocialMediaLinks } from "@/schemas/socialMedia";
import AddProjectCard from "@/components/ui/card-adicionar-projeto";
import BadgeHabilidades from "@/components/ui/BadgeHabilidades";
import SocialMedia from "@/components/ui/socila-medias";
import ProjectCard from "@/components/ui/card-projeto";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: {
    id: string; // URL param: user ID
  };
};

export default async function ProfilePage({ params }: Props) {
  const session = await getSession();

  const userData = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      events: true,
      Project: {
        include: { event: true },
        orderBy: { createdAt: "desc" },
      },
      sessions: true,
    },
  });

  if (!userData) return notFound(); // ⛔ Show 404 if no user
  console.log(userData.Project);

  const midias: SocialMediaLinks[] = socialMediasSchema.parse(userData.midiasSocias ?? []);

  return (
    <main className="p-6 text-white">
      <div className="flex flex-row justify-between items-center mb-8">
        <section className="flex items-center gap-6 ">
          <div className="flex flex-col items-center">
            <Image
              src={userData.image || "/placeholder.png"}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full"
            />

            {midias.length > 0 && (
              <div className="flex flex-row mt-2">
                {midias.map((midia) => (
                  <div key={midia.link}>
                    <SocialMedia typeOfSocial={midia.nome} link={midia.link} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-sm text-gray-400">{userData.email}</p>
          </div>
        </section>
      </div>

      <section>
        <div>{userData.descricaoPerfil}</div>
        <div className="flex flex-wrap flex-row my-4">
          {userData?.habilidades &&
            userData.habilidades.split(";").map((habilidade) => (
              <div key={habilidade} className="mr-1">
                <BadgeHabilidades nome={habilidade} />
              </div>
            ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Meus eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.events.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-xl p-4 shadow">
              <div className="w-full h-[200px] relative mb-2">
                <Image
                  src={event.image || "/placeholder-event.jpg"}
                  alt={event.title}
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-2">
                {event.description}
              </p>
              <p className="text-xs mt-1 text-gray-400">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <Link
                href={`/event/${event.slug}`}
                className="text-orange-500 text-sm font-medium"
              >
                Ver mais
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Projetos feitos em hackathons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.Project.map((project) => (
            <ProjectCard
              id={project.id}
              key={project.title}
              nome={project.title}
              link={project.url}
              rank={project.award}
              img={project.image}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
