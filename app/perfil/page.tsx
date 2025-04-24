import { socialMediasSchema, type SocialMedia as SocialMediaLinks } from "@/schemas/socialMedia";
import AddProjectCard from "@/components/ui/card-adicionar-projeto";
import BadgeHabilidades from "@/components/ui/BadgeHabilidades";
import ProjectCard from "@/components/ui/card-projeto";
import SocialMedia from "@/components/ui/socila-medias";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getSession();

  if (!user) return <div>Usuário não autenticado.</div>;

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      events: true,
      Project: {
        include: { event: true },
        orderBy: { createdAt: "desc" },
      },
      sessions: true,
    },
  });

  if (!userData) return <div>Usuário não encontrado.</div>;

  const midias: SocialMediaLinks[] = socialMediasSchema.parse(userData.midiasSocias ?? []);

  // console.log(userData.Project);
  //

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

        <div>
          <Link href="/perfil/editar">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Editar perfil
            </Button>
          </Link>
        </div>
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

        <div className="mt-8">
          <Link href="/eventos/novo">
            <Button variant="outline">Sugerir um evento</Button>
          </Link>
        </div>
      </section>
      {/* Podiums */}
      {/* Certificados */}

      {/* Projetos */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Projetos feitos em hackathons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.Project.map((project) => (
            <ProjectCard
              id={project.id}
              key={project.title}
              isEditable
              nome={project.title}
              link={project.url}
              rank={project.award}
              img={project.image}
            />
          ))}

          <AddProjectCard />
        </div>
      </section>
    </main>
  );
}

// meus eventos colocar os eventos que eu vou participar
