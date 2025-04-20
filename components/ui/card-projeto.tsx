"use client";

import { deleteProjetc } from "@/lib/actions/delete-project";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiTrash } from "react-icons/fi"; // Ícone de lixeira

export type Props = {
  id: string;
  nome: string;
  events: string;
  rank: string;
  img: string;
  link: string;
  isEditable?: boolean; // nova prop opcional
};

export default function ProjectCard({
  id,
  nome,
  events,
  rank,
  img,
  link,
  isEditable = false, // valor padrão
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    await deleteProjetc(id);
    setShowConfirm(false);
  };

  return (
    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-lg group">
      {/* Botão de deletar no canto superior direito */}
      {isEditable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowConfirm(true);
          }}
          className="absolute top-2 right-2 z-20 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
          title="Deletar"
        >
          <FiTrash size={18} />
        </button>
      )}

      <Link
        href={link == null ? "#" : link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative h-64 w-full">
          <Image
            src={img}
            alt={nome}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-end p-4">
            <h2 className="text-xl font-bold text-white drop-shadow-md">
              {nome}
            </h2>
            {/* <p className="text-sm text-gray-200">Evento: {events}</p> */}
            <p className="text-sm text-gray-200">Colocação: {rank}</p>
          </div>
        </div>
      </Link>

      {/* Modal de confirmação */}
      {isEditable && showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
          <div className="bg-white text-black p-6 rounded-lg max-w-xs shadow-md space-y-4">
            <p>Tem certeza que deseja deletar este projeto?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
