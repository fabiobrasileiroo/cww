import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Criar usuário root
  const rootPassword = await bcrypt.hash("root123", 10)
  const root = await prisma.user.upsert({
    where: { email: "root@cww.com" },
    update: {},
    create: {
      email: "root@cww.com",
      name: "Super Admin",
      password: rootPassword,
      role: Role.ROOT,
    },
  })
  console.log({ root })

  // Criar usuário admin
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@cww.com" },
    update: {},
    create: {
      email: "admin@cww.com",
      name: "Admin CWW",
      password: adminPassword,
      role: Role.ADMIN,
    },
  })
  console.log({ admin })

  // Criar usuário comum
  const userPassword = await bcrypt.hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@cww.com" },
    update: {},
    create: {
      email: "user@cww.com",
      name: "Usuário Comum",
      password: userPassword,
      role: Role.USER,
    },
  })
  console.log({ user })

  // Criar alguns eventos de exemplo
  const events = [
    {
      title: "Hack-Mogi 2024",
      slug: "hack-mogi-2024",
      description: "O maior hackathon de Mogi das Cruzes com foco em soluções para cidades inteligentes.",
      longDescription:
        "Lorem ipsum dolor sit amet consectetur. Sit accumsan aliquam feugiat congue posuere sed odio libero. Aliquet morbi ultrices felis feugiat curabitur laoreet aenean venenatis nec. Pellentesque vitae ullamcorper sed integer quam mauris ipsum sed id. Est leo enim eleifend mauris diam porttitor mauris morbi. Placerat blandit ut quisque vitae maecenas nunc. Gravida cras volutpat non consequat a auctor orci.",
      location: "São Paulo - SP",
      date: new Date("2024-06-15"),
      time: "09:00 - 18:00",
      contact: "+55 11 99999-9999",
      prize: "R$ 25.000",
      image: "/placeholder.svg",
      category: "cft",
      categoryColor: "purple",
      secondCategory: "crypto",
      secondCategoryColor: "green",
      status: "APPROVED",
      authorId: admin.id,
    },
    {
      title: "AI Challenge",
      slug: "ai-challenge",
      description: "Evento focado em soluções de inteligência artificial para problemas reais do mercado financeiro.",
      longDescription:
        "Lorem ipsum dolor sit amet consectetur. Sit accumsan aliquam feugiat congue posuere sed odio libero. Aliquet morbi ultrices felis feugiat curabitur laoreet aenean venenatis nec. Pellentesque vitae ullamcorper sed integer quam mauris ipsum sed id. Est leo enim eleifend mauris diam porttitor mauris morbi. Placerat blandit ut quisque vitae maecenas nunc. Gravida cras volutpat non consequat a auctor orci.",
      location: "Rio de Janeiro - RJ",
      date: new Date("2024-07-10"),
      time: "10:00 - 19:00",
      contact: "+55 21 99999-9999",
      prize: "R$ 30.000",
      image: "/placeholder.svg",
      category: "ia",
      categoryColor: "blue",
      status: "APPROVED",
      authorId: admin.id,
    },
    {
      title: "Blockchain Summit",
      slug: "blockchain-summit",
      description:
        "Venha desenvolver soluções inovadoras utilizando tecnologia blockchain e concorra a prêmios incríveis.",
      longDescription:
        "Lorem ipsum dolor sit amet consectetur. Sit accumsan aliquam feugiat congue posuere sed odio libero. Aliquet morbi ultrices felis feugiat curabitur laoreet aenean venenatis nec. Pellentesque vitae ullamcorper sed integer quam mauris ipsum sed id. Est leo enim eleifend mauris diam porttitor mauris morbi. Placerat blandit ut quisque vitae maecenas nunc. Gravida cras volutpat non consequat a auctor orci.",
      location: "Belo Horizonte - MG",
      date: new Date("2024-08-05"),
      time: "08:30 - 17:30",
      contact: "+55 31 99999-9999",
      prize: "R$ 20.000",
      image: "/placeholder.svg",
      category: "blockchain",
      categoryColor: "green",
      status: "PENDING",
      authorId: user.id,
    },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    })
  }

  console.log("Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
