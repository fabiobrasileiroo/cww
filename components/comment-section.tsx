"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addComment, likeComment } from "@/lib/actions/event-actions";
import { useFormState } from "react-dom";
import { useAuth } from "@/components/auth-provider";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  likes: number;
  author: {
    name: string;
    image?: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  eventId: string;
  comments: Comment[];
}

const initialState = {
  error: null,
  success: false,
};

export default function CommentSection({
  eventId,
  comments,
}: CommentSectionProps) {
  const [state, formAction] = useActionState(addComment, initialState);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useAuth();

  const handleLike = async (commentId: string) => {
    await likeComment(commentId);
  };

  return (
    <section className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Comentários</h2>

      {user ? (
        <div className="mb-6">
          <form action={formAction} className="space-y-2">
            <input type="hidden" name="eventId" value={eventId} />
            <Textarea
              name="content"
              placeholder="Escreva um comentário..."
              className="bg-gray-700 border-gray-600 mb-2"
              rows={3}
              required
            />
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Publicar
            </Button>
          </form>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg text-center">
          <p className="text-gray-300">Faça login para deixar um comentário</p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-700 pb-4 last:border-0"
            >
              <div className="flex gap-3">
                <Link href={`/perfil/${comment.authorId}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.author.image || "/placeholder.svg"}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {comment.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Link href={`/perfil/${comment.authorId}`}>
                      <div>
                        <p className="font-semibold">{comment.author.name}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Reportar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-200">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-400 hover:text-white"
                      onClick={() => handleLike(comment.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </Button>
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-gray-400 hover:text-white"
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id,
                          )
                        }
                      >
                        <Reply className="h-4 w-4" />
                        <span>Responder</span>
                      </Button>
                    )}
                  </div>

                  {/* Área de resposta */}
                  {replyingTo === comment.id && (
                    <div className="mt-3">
                      <form action={formAction} className="space-y-2">
                        <input type="hidden" name="eventId" value={eventId} />
                        <input
                          type="hidden"
                          name="parentId"
                          value={comment.id}
                        />
                        <Textarea
                          name="content"
                          placeholder={`Respondendo para ${comment.author.name}...`}
                          className="bg-gray-700 border-gray-600 mb-2"
                          rows={2}
                          required
                        />
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            Responder
                          </Button>
                          <Button
                            onClick={() => setReplyingTo(null)}
                            size="sm"
                            variant="outline"
                            type="button"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Respostas */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-6 border-l border-gray-700">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Link href={`/perfil/${reply.authorId}`}>
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={reply.author.image || "/placeholder.svg"}
                                alt={reply.author.name}
                              />
                              <AvatarFallback>
                                {reply.author.name
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <Link href={`/perfil/${reply.authorId}`}>
                                <div>
                                  <p className="font-semibold">
                                    {reply.author.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {formatDate(reply.createdAt)}
                                  </p>
                                </div>
                              </Link>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Reportar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="mt-1">
                              <p className="text-gray-200">{reply.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-gray-400 hover:text-white"
                                onClick={() => handleLike(reply.id)}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span>{reply.likes}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
