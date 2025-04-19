import Link from "next/link";
import { FaBeer, FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";

type Props = {
  typeOfSocial: string;
  link: string;
};
function SocialMedia(props: Props) {
  let icon;

  if (props.typeOfSocial == "github") icon = <FaGithub />;
  else if (props.typeOfSocial == "linkedin") icon = <FaLinkedin />;
  else if (props.typeOfSocial == "whatsapp") icon = <FaWhatsapp />;

  return (
    <Link className="text-2xl" href={props.link}>
      {icon}
    </Link>
  );
}

export default SocialMedia;
