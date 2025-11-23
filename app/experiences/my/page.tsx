import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Edit } from "lucide-react";
import DeleteExperienceButton from "@/components/delete-experience-button";

export default async function MyExperiencesPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground text-xl">
        Please sign in to manage your experiences.
      </div>
    );
  }

  const experiences = await prisma.experience.findMany({
    where: { userId: session.user?.id },
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Experiences
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and update your shared travel memories.
            </p>
          </div>
          <Link href="/experiences/new">
            <Button size="lg" className="shadow-sm">
              Share New Experience
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          {experiences.length === 0 ? (
            <Card className="border-dashed border-2 shadow-none bg-secondary/10">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-secondary/50 p-4 rounded-full mb-4">
                  <Image
                    src="/globe.svg"
                    alt="Globe"
                    width={48}
                    height={48}
                    className="opacity-50"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No experiences yet
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Share your travel experiences with the world. Add photos,
                  locations, and stories from your adventures!
                </p>
                <Link href="/experiences/new">
                  <Button>Share Your First Experience</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((experience) => (
                <Card
                  key={experience.id}
                  className="group h-full hover:shadow-md transition-all duration-300 border-border hover:border-primary/50 flex flex-col overflow-hidden"
                >
                  <div className="relative w-full aspect-video overflow-hidden bg-secondary/20">
                    {experience.images.length > 0 ? (
                      <Image
                        src={experience.images[0].url}
                        alt={experience.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
                        {experience.title}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary/60"></span>
                      {experience.locationName}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <p className="text-muted-foreground line-clamp-2 text-sm flex-1">
                      {experience.description}
                    </p>

                    <div className="pt-4 mt-auto border-t border-border space-y-3">
                      <div className="text-xs text-muted-foreground">
                        Shared on{" "}
                        {new Date(experience.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href={`/experiences/${experience.id}/edit`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full hover:bg-secondary/80"
                            size="sm"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <DeleteExperienceButton experienceId={experience.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
