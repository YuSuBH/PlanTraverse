"use server";

import { redirect } from "next/navigation";
import { prisma } from "./../prisma";
import { auth } from "@/auth";

export async function createTrip(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("Not authenticated>");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const satrtDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  if (!title || !description || !satrtDateStr || !endDateStr) {
    throw new Error("All fields are required.");
  }

  const startDate = new Date(satrtDateStr);
  const endDate = new Date(endDateStr); 

  await prisma.trip.create({
    data: {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      userId: session.user.id,
    },
  });

  redirect("/trips");
}
