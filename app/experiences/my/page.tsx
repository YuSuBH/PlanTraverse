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
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
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
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Experiences</h1>
        <Link href="/experiences/new">
          <Button>Share New Experience</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Your Travel Experiences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {experiences.length === 0
              ? "You haven't shared any experiences yet. Start by sharing your first travel memory!"
              : `You have shared ${experiences.length} ${
                  experiences.length === 1 ? "experience" : "experiences"
                }.`}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Experiences</h2>
        {experiences.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h3 className="text-xl font-medium mb-2">No experiences yet.</h3>
              <p className="text-center mb-4 max-w-md text-gray-600">
                Share your travel experiences with the world. Add photos,
                locations, and stories from your adventures!
              </p>
              <Link href="/experiences/new">
                <Button>Share Your First Experience</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiences.map((experience) => (
              <Card
                key={experience.id}
                className="h-full hover:shadow-md transition-shadow"
              >
                {experience.images.length > 0 && (
                  <div className="relative w-full h-48">
                    <Image
                      src={experience.images[0].url}
                      alt={experience.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">
                    {experience.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {experience.locationName}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {experience.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Shared on{" "}
                    {new Date(experience.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/experiences/${experience.id}/edit`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteExperienceButton experienceId={experience.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
