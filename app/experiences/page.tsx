import { prisma } from "@/lib/prisma";
import ExperienceMap from "@/components/experience-map";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";

export default async function ExperiencesPage() {
  const session = await auth();

  const experiences = await prisma.experience.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Travel Experiences
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore shared travel experiences from around the world
          </p>
        </div>
        {session && (
          <Link href="/experiences/new">
            <Button size="lg">Share Experience</Button>
          </Link>
        )}
      </div>
      <div className="flex-1 w-full">
        <ExperienceMap experiences={experiences} />
      </div>
    </div>
  );
}
