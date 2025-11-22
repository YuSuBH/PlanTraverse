import { Experience, ExperienceImage, User } from "@/app/generated/prisma";

export interface ExperienceWithDetails extends Experience {
  user: Pick<User, "name" | "image">;
  images: ExperienceImage[];
}
