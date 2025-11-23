"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export async function deleteExperience(experienceId: string) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  // Verify the experience belongs to the user
  const experience = await prisma.experience.findUnique({
    where: { id: experienceId },
    select: { userId: true },
  });

  if (!experience) {
    throw new Error("Experience not found");
  }

  if (experience.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Delete the experience (images will cascade delete)
  await prisma.experience.delete({
    where: { id: experienceId },
  });

  revalidatePath("/experiences/my");
  revalidatePath("/experiences");
}
