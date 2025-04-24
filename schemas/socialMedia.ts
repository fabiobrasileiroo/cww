import { z } from "zod";

export const socialMediaSchema = z.object({
  nome: z.string(),
  link: z.string().url(),
});

export const socialMediasSchema = z.array(socialMediaSchema);

export type SocialMedia = z.infer<typeof socialMediaSchema>;