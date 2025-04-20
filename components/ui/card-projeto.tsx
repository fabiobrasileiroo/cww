import Image from "next/image";
import Link from "next/link";

export type Props = {
  nome: string;
  events: string;
  rank: string;
  img: string;
  link: string;
};

export default function ProjectCard({ nome, events, rank, img, link }: Props) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-lg group block"
    >
      <div className="relative h-64 w-full">
        <Image
          src={img}
          alt={nome}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
          <h2 className="text-xl font-bold text-white drop-shadow-md">
            {nome}
          </h2>
          <p className="text-sm text-gray-200">Evento: {events}</p>
          <p className="text-sm text-gray-200">Colocação: {rank}</p>
        </div>
      </div>
    </Link>
  );
}
