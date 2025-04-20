import Image from "next/image";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Phone, Award, Link } from "lucide-react";
import CommentSection from "@/components/comment-section";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  // Buscar evento do banco de dados
  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      comments: {
        where: {
          isReply: false,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  // Buscar respostas para os comentários
  const replies = await prisma.comment.findMany({
    where: {
      eventId: event.id,
      isReply: true,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  // Organizar comentários e respostas
  const commentsWithReplies = event.comments.map((comment) => {
    const commentReplies = replies.filter(
      (reply) => reply.parentId === comment.id,
    );
    return {
      ...comment,
      replies: commentReplies,
    };
  });

  const getCategoryColorClass = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-600";
      case "green":
        return "bg-green-600";
      case "blue":
        return "bg-blue-600";
      case "red":
        return "bg-red-600";
      case "teal":
        return "bg-teal-600";
      case "orange":
        return "bg-orange-600";
      case "pink":
        return "bg-pink-600";
      case "yellow":
        return "bg-yellow-600";
      case "emerald":
        return "bg-emerald-600";
      default:
        return "bg-gray-700";
    }
  };

  const handelParticipar = () => {
    alert(`redirecionando para ${event.urlEvento}`);
  };

  return (
    <div className="py-8">
      <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
          <div className="flex gap-2 mb-4">
            <Badge className={`${getCategoryColorClass(event.categoryColor)}`}>
              {event.category}
            </Badge>
            {event.secondCategory && (
              <Badge
                className={`${getCategoryColorClass(event.secondCategoryColor || "")}`}
              >
                {event.secondCategory}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Descrição do Evento</h2>
            <p className="text-gray-300">
              {event.longDescription || event.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Sobre os organizadores</h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{event.author.name}</h3>
              <p className="text-gray-300">
                Organizador do evento {event.title}. Entre em contato através do
                email {event.author.email}.
              </p>
            </div>
          </section>

          <CommentSection eventId={event.id} comments={commentsWithReplies} />
        </div>

        <div>
          <div className="bg-gray-800 p-6 rounded-lg sticky top-24">
            <h3 className="text-xl font-bold mb-4">Informações</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="text-orange-500" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-orange-500" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-orange-500" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-orange-500" />
                <span>{event.contact}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="text-orange-500" />
                <span>Premiação: {event.prize}</span>
              </div>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              <NextLink href={event.urlEvento}>Participar</NextLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
