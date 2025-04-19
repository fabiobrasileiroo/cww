import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, Calendar, CheckCircle, Clock, Users, XCircle } from "lucide-react"
import prisma from "@/lib/prisma"

export default async function AdminPage() {
  const totalUsers = await prisma.user.count()

  // Contagem por status de eventos
  const [pendingEvents, approvedEvents, rejectedEvents] = await Promise.all([
    prisma.event.count({ where: { status: "PENDING" } }),
    prisma.event.count({ where: { status: "APPROVED" } }),
    prisma.event.count({ where: { status: "REJECTED" } }),
  ])

  // Eventos futuros
  const upcomingEvents = await prisma.event.count({
    where: {
      date: {
        gte: new Date(), // pega eventos com data a partir de hoje
      },
      status: "APPROVED", // opcional: só considerar aprovados
    },
  })

  // Objeto final
  const stats = {
    totalUsers,
    pendingEvents,
    approvedEvents,
    rejectedEvents,
    upcomingEvents,
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Eventos Pendentes</CardTitle>
            <CardDescription>Aguardando aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-3xl font-bold">{stats.pendingEvents}</span>
              </div>
              <Link href="/admin/eventos/pendentes">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Eventos Aprovados</CardTitle>
            <CardDescription>Eventos que já foram aprovados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-3xl font-bold">{stats.approvedEvents}</span>
              </div>
              <Link href="/admin/eventos/aprovados">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Eventos Rejeitados</CardTitle>
            <CardDescription>Eventos que não foram aprovados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-3xl font-bold">{stats.rejectedEvents}</span>
              </div>
              <Link href="/admin/eventos/rejeitados">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total de Usuários</CardTitle>
            <CardDescription>Usuários cadastrados na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-3xl font-bold">{stats.totalUsers}</span>
              </div>
              <Link href="/admin/usuarios">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Próximos Eventos</CardTitle>
            <CardDescription>Eventos agendados para o futuro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-500 mr-2" />
                <span className="text-3xl font-bold">{stats.upcomingEvents}</span>
              </div>
              <Link href="/admin/eventos/futuros">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tempo Total Gasto</CardTitle>
            <CardDescription>Tempo investido em eventos (simulado)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-teal-500 mr-2" />
                <span className="text-3xl font-bold">450h</span>
              </div>
              <Button variant="outline" size="sm" disabled>
                Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
