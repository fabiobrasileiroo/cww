import { getSession } from "@/lib/auth";
import AddProjectCard from "@/components/ui/card-adicionar-projeto";
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

  return (
    <main className="p-6 text-white">
      <section className="flex items-center gap-6 mb-8">
        <Image
          src={userData.image || "/placeholder.png"}
          alt="Avatar"
          width={120}
          height={120}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p className="text-sm text-gray-400">{userData.email}</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Meus eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.events.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-xl p-4 shadow">
              <Image
                src={event.image || "/placeholder-event.jpg"}
                alt={event.title}
                width={400}
                height={200}
                className="rounded-lg mb-2 object-cover"
              />
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
            <div key={project.id} className="relative group">
              <Image
                src={project.image || "/placeholder-project.jpg"}
                alt={project.title}
                width={400}
                height={200}
                className="rounded-lg object-cover brightness-75 group-hover:brightness-100 transition"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg drop-shadow">
                  {project.title}
                </h3>
                <p className="text-sm drop-shadow">
                  {project.event?.title || "Projeto individual"}
                </p>
                {project.award && (
                  <p className="text-md font-bold drop-shadow">
                    {project.award}
                  </p>
                )}
              </div>
            </div>
          ))}

          <AddProjectCard />
          <Link
            href="/project/create"
            className="flex items-center justify-center border-2 border-orange-500 rounded-lg h-[200px] hover:bg-orange-500 transition"
          >
            <span className="text-orange-500 group-hover:text-white font-bold text-lg">
              + Adicionar Projeto
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
// import prisma from "@/lib/prisma";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import Image from "next/image";
// import SocialMedia from "@/components/ui/socila-medias";
// import { Badge } from "@/components/ui/badge";
// import ProjectCard from "@/components/ui/card-projeto";
// import AddProjectCard from "@/components/ui/card-adicionar-projeto";
//
// async function Perfil() {
//   const perfil = await prisma.user.findUnique({
//     where: { id: "cm9n8mjtv0000ij4vnojc4ehg" },
//     select: {
//       name: true,
//     },
//   });
//   console.log("perfil info", perfil);
//
//   const getCategoryBadge = (tipo: string, nome: string) => {
//     if (!tipo) return null;
//
//     switch (tipo) {
//       case "front":
//         return <Badge className="bg-green-600 mr-4">{nome}</Badge>;
//       case "dados":
//         return <Badge className="bg-yellow-600 mr-4">{nome}</Badge>;
//       case "security":
//         return <Badge className="bg-red-600 mr-4">{nome}</Badge>;
//       case "web3":
//         return <Badge className="bg-blue-600 mr-4">{nome}</Badge>;
//       default:
//         return null;
//     }
//   };
//
//   perfil.social = [
//     { type: "whatsapp", link: "https://whatsapp.com" },
//     { type: "linkedin", link: "https://linkedin.com" },
//     { type: "github", link: "https://github.com" },
//   ];
//
//   perfil.descricao =
//     "Lorem ipsum dolor sit amet consectetur. Faucibus dui purus lectus id suspendisse semper in risus nascetur. Consectetur a fusce gravida lorem pulvinar in vitae. Enim interdum ac lobortis nec in. Arcu nascetur purus vitae at egestas gravida sit tellus. Fermentum convallis vitae id ac. Sem id lacus lacus phasellus tellus dolor. Orci et mi mauris vitae et et facilisis.";
//
//   perfil.tags = [
//     { nome: "Typescript", tipo: "front" },
//     { nome: "React", tipo: "front" },
//     { nome: "Python", tipo: "dados" },
//     { nome: "Ai", tipo: "dados" },
//     { nome: "Cyber security", tipo: "security" },
//     { nome: "Web3", tipo: "web3" },
//     { nome: "Solidity", tipo: "web3" },
//   ];
//
//   perfil.projetos = [
//     {
//       nome: "Tinder decavalos",
//       events: "Hackathon IBAMA",
//       rank: "1° Lugar",
//       img: "https://i.ibb.co/N28XMtVn/VQyr-PPyh-FGd-V2-BJtlcw-Dphesnx-ERD6-SLWv-Gt-ARyg-LDVNSs-Xh-FF0kz-G-y-Xv-Lyi-ARZb-KIG3-VYF-CIb-F4-B.webp",
//       link: "https://github.com",
//     },
//     {
//       nome: "Truco do Doge",
//       events: "Hackathon Blaze",
//       rank: "Participante",
//       img: "https://i.ibb.co/N28XMtVn/VQyr-PPyh-FGd-V2-BJtlcw-Dphesnx-ERD6-SLWv-Gt-ARyg-LDVNSs-Xh-FF0kz-G-y-Xv-Lyi-ARZb-KIG3-VYF-CIb-F4-B.webp",
//       link: "https://github.com",
//     },
//     {
//       nome: "Rilha de carecas",
//       events: "Hackathon ministerio da inculsão",
//       rank: "2° Lugar",
//       img: "https://i.ibb.co/N28XMtVn/VQyr-PPyh-FGd-V2-BJtlcw-Dphesnx-ERD6-SLWv-Gt-ARyg-LDVNSs-Xh-FF0kz-G-y-Xv-Lyi-ARZb-KIG3-VYF-CIb-F4-B.webp",
//       link: "https://github.com",
//     },
//   ];
//
//   return (
//     <main>
//       <div className="flex">
//         {/* image and social medias */}
//         <div className=" flex flex-col items-center ">
//           <Image
//             className="rounded-full h-[200px] mim-w-[400px] mr-8"
//             alt={`imagem de perfil do ${perfil?.name}`}
//             src="https://i.ibb.co/N28XMtVn/VQyr-PPyh-FGd-V2-BJtlcw-Dphesnx-ERD6-SLWv-Gt-ARyg-LDVNSs-Xh-FF0kz-G-y-Xv-Lyi-ARZb-KIG3-VYF-CIb-F4-B.webp"
//             width={400}
//             height={400}
//           />
//           <p className="text-xl mb-2 mt-4 font-bold ">{perfil?.name}</p>
//           <div className="flex flex-row">
//             {perfil.social.map((social) => (
//               <SocialMedia typeOfSocial={social.type} link={social.link} />
//             ))}
//           </div>
//         </div>
//         {/* Descricao e tags */}
//         <div>
//           <p>{perfil.descricao}</p>
//           <div className="mt-4 ">
//             {perfil.tags.map((tag) => getCategoryBadge(tag.tipo, tag.nome))}
//           </div>
//         </div>
//       </div>
//       {/* desafios feitos em hackathons */}
//       <section>
//         <h1 className="text-3xl font-bold mb-6">Criar Novo Evento</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center">
//           {perfil.projetos.map((projeto) => (
//             <ProjectCard key={projeto.nome} {...projeto} />
//           ))}
//
//         </div>
//       </section>
//     </main>
//   );
// }
//
// export default Perfil;
