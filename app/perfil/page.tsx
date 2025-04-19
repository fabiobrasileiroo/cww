import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProfilePage() {
  const user = await getSession()

  if (!user) return <div>Usuário não autenticado.</div>

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      events: true,
      Project: {
        include: { event: true },
        orderBy: { createdAt: 'desc' },
      },
      sessions: true,
    },
  })

  if (!userData) return <div>Usuário não encontrado.</div>

  return (
    <main className="p-6 text-white">
      <section className="flex items-center gap-6 mb-8">
        <Image
          src={userData.image || '/placeholder.png'}
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
          {userData.events.map(event => (
            <div key={event.id} className="bg-gray-800 rounded-xl p-4 shadow">
              <Image
                src={event.image || '/placeholder-event.jpg'}
                alt={event.title}
                width={400}
                height={200}
                className="rounded-lg mb-2 object-cover"
              />
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-2">{event.description}</p>
              <p className="text-xs mt-1 text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
              <Link href={`/event/${event.slug}`} className="text-orange-500 text-sm font-medium">Ver mais</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Projetos feitos em hackathons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.Project.map(project => (
            <div key={project.id} className="relative group">
              <Image
                src={project.image || '/placeholder-project.jpg'}
                alt={project.title}
                width={400}
                height={200}
                className="rounded-lg object-cover brightness-75 group-hover:brightness-100 transition"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg drop-shadow">{project.title}</h3>
                <p className="text-sm drop-shadow">
                  {project.event?.title || 'Projeto individual'}
                </p>
                {project.award && <p className="text-md font-bold drop-shadow">{project.award}</p>}
              </div>
            </div>
          ))}

          <Link href="/project/create" className="flex items-center justify-center border-2 border-orange-500 rounded-lg h-[200px] hover:bg-orange-500 transition">
            <span className="text-orange-500 group-hover:text-white font-bold text-lg">+ Adicionar Projeto</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
