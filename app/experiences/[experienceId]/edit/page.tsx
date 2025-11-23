import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditExperienceForm from "@/components/edit-experience-form";

interface EditExperiencePageProps {
  params: {
    experienceId: string;
  };
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const experience = await prisma.experience.findUnique({
    where: {
      id: params.experienceId,
    },
    include: {
      images: true,
    },
  });

  if (!experience) {
    notFound();
  }

  // Verify ownership
  if (experience.userId !== session.user?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          You don`&apos`t have permission to edit this experience.
        </div>
      </div>
    );
  }

  return <EditExperienceForm experience={experience} />;
}
