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
    <div className="h-[calc(100vh-80px)] flex flex-col bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Travel Experiences
          </h1>
          <p className="text-muted-foreground">
            Explore shared travel experiences from around the world
          </p>
        </div>
        {session && (
          <Link href="/experiences/new">
            <Button>Share Experience</Button>
          </Link>
        )}
      </div>
      <div className="flex-1 container mx-auto px-4 pb-4">
        <ExperienceMap experiences={experiences} />
      </div>
    </div>
  );
}
