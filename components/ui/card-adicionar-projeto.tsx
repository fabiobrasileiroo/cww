import Link from "next/link";

export default function AddProjectCard() {
  return (
    <Link
      href="/perfil/adicionar-projeto"
      className="w-full max-w-sm h-64 border-4 border-[#FD6100] rounded-2xl flex items-center justify-center text-center hover:bg-orange-50 transition-colors duration-200"
    >
      <div className="flex flex-col items-center">
        <span className="text-4xl text-[#FD6100] font-bold mb-2">+</span>
        <span className="text-lg text-[#FD6100] font-medium">
          Adicionar Projeto
        </span>
      </div>
    </Link>
  );
}
