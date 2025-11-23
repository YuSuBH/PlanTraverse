"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteExperience } from "@/lib/actions/delete-experience";

interface DeleteExperienceButtonProps {
  experienceId: string;
}

export default function DeleteExperienceButton({
  experienceId,
}: DeleteExperienceButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    startTransition(() => {
      deleteExperience(experienceId);
    });
  };

  return (
    <>
      {!showConfirm ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      ) : (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? "Deleting..." : "Confirm Delete?"}
        </Button>
      )}
    </>
  );
}
