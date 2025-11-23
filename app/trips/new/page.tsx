"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createTrip } from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/upload-thing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useTransition } from "react";

export default function NewTrip() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Plan a New Trip</h1>
        <p className="text-muted-foreground mt-2">
          Start organizing your next adventure.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6 md:p-8">
          <form
            className="space-y-8"
            action={(formData: FormData) => {
              if (imageUrl) {
                formData.append("imageUrl", imageUrl);
              }

              startTransition(() => {
                createTrip(formData);
              });
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Trip Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Summer in Italy"
                  className={cn(
                    "w-full border border-input bg-background px-4 py-3",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  )}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="What's this trip about?"
                  rows={4}
                  className={cn(
                    "w-full border border-input bg-background px-4 py-3",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y"
                  )}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className={cn(
                      "w-full border border-input bg-background px-4 py-3",
                      "rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    )}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className={cn(
                      "w-full border border-input bg-background px-4 py-3",
                      "rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    )}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <label className="block text-lg font-semibold text-foreground">
                Cover Image
              </label>

              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/20 transition-colors">
                {imageUrl ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 shadow-sm">
                    <Image
                      src={imageUrl}
                      alt="Trip Preview"
                      className="object-cover"
                      fill
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res[0].ufsUrl) {
                          setImageUrl(res[0].ufsUrl);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        console.error("Upload error: ", error);
                      }}
                      appearance={{
                        button:
                          "bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md text-sm font-medium transition-colors",
                        allowedContent: "text-muted-foreground text-sm mt-2",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isPending}
                size="lg"
                className="w-full text-lg h-12"
              >
                {isPending ? "Creating Trip..." : "Create Trip"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
