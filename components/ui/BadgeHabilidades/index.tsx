import { Badge } from "@/components/ui/badge";

type Props = {
  nome: string;
};

function BadgeHabilidades(props: Props) {
  let tipo = "";
  if (props.nome == "React" || props.nome == "NextJs") tipo = "front";
  else if (props.nome == "Python" || props.nome == "AI") tipo = "dados";
  else if (props.nome == "Cyber Security") tipo = "security";
  else if (props.nome == "Web3") tipo = "web3";
  else if (props.nome == "Go" || props.nome == "Rust") tipo = "back";

  switch (tipo) {
    case "front":
      return <Badge className="bg-green-600 mr-4">{props.nome}</Badge>;
    case "dados":
      return <Badge className="bg-yellow-600 mr-4">{props.nome}</Badge>;
    case "security":
      return <Badge className="bg-red-600 mr-4">{props.nome}</Badge>;
    case "web3":
      return <Badge className="bg-purple-600 mr-4">{props.nome}</Badge>;
    case "back":
      return <Badge className="bg-blue-600 mr-4">{props.nome}</Badge>;
    default:
      return <Badge className="bg-gray-600 mr-4">{props.nome}</Badge>;
  }
}

export default BadgeHabilidades;
