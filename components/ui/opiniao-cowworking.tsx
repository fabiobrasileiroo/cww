import Image from "next/image";

type Props = {
  opniao: string;
  selo: "PRATA" | "OURO" | "BRONZE" | "LATAO" | "NAO_RECOMENDA";
};

// Mapeamento das cores por selo
const seloStyles: Record<
  Props["selo"],
  { borderColor: string; textColor: string }
> = {
  OURO: {
    borderColor: "border-yellow-400",
    textColor: "text-yellow-400",
  },
  PRATA: {
    borderColor: "border-gray-400",
    textColor: "text-gray-400",
  },
  BRONZE: {
    borderColor: "border-amber-700",
    textColor: "text-amber-700",
  },
  LATAO: {
    borderColor: "border-yellow-800",
    textColor: "text-yellow-800",
  },
  NAO_RECOMENDA: {
    borderColor: "border-red-600",
    textColor: "text-red-600",
  },
};

export default function OpiniaoCowworking(props: Props) {
  const styles = seloStyles[props.selo];

  return (
    <section className="relative py-10 px-6 rounded-lg bg-[#1a1a1a]">
      <h2 className="text-3xl font-bold mb-6">Opinião Coworking</h2>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <p className="text-gray-300 max-w-3xl">{props.opniao}</p>

        {/* Logo e selo */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 border-4 rounded-full ${styles.borderColor}`}
          >
            <Image
              src="/cww-logo.svg"
              width={40}
              height={40}
              alt={`Logo ${props.selo}`}
            />
          </div>
          <span className={`font-bold text-xl sm:text-2xl ${styles.textColor}`}>
            {props.selo.replace("_", " ")}
          </span>
        </div>
      </div>
    </section>
  );
}
