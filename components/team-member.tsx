import Image from "next/image"

interface TeamMemberProps {
  member: {
    id: number
    name: string
    role: string
    image: string
  }
}

export default function TeamMember({ member }: TeamMemberProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3">
        <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
      </div>
      <h3 className="font-semibold text-center">{member.name}</h3>
      <p className="text-sm text-gray-400 text-center">{member.role}</p>
    </div>
  )
}
