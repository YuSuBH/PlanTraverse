"use client";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Experience, ExperienceImage, User } from "@/app/generated/prisma";

interface ExperienceWithDetails extends Experience {
  user: Pick<User, "name" | "image">;
  images: ExperienceImage[];
}

interface ExperienceMapProps {
  experiences: ExperienceWithDetails[];
}

export default function ExperienceMap({ experiences }: ExperienceMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceWithDetails | null>(null);
  const [hoveredExperience, setHoveredExperience] =
    useState<ExperienceWithDetails | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show either clicked or hovered experience (clicked takes priority)
  const displayedExperience = selectedExperience || hoveredExperience;

  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const center =
    experiences.length > 0
      ? { lat: experiences[0].lat, lng: experiences[0].lng }
      : { lat: 0, lng: 0 };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      zoom={3}
      center={center}
      onClick={() => {
        setSelectedExperience(null);
        setHoveredExperience(null);
      }}
    >
      {experiences.map((experience) => (
        <Marker
          key={experience.id}
          position={{ lat: experience.lat, lng: experience.lng }}
          title={experience.title}
          onClick={(e) => {
            e.stop(); // Prevent map onClick from firing
            // Clear any pending hover timeout
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
            setSelectedExperience(experience);
            setHoveredExperience(null);
          }}
          onMouseOver={() => {
            // Only set hover if nothing is clicked
            if (!selectedExperience) {
              // Clear any existing timeout
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              // Set hover immediately
              setHoveredExperience(experience);
            }
          }}
          onMouseOut={() => {
            // Don't do anything - let InfoWindow's onMouseLeave handle it
            // This prevents flickering when InfoWindow appears over the marker
          }}
        />
      ))}

      {displayedExperience && (
        <InfoWindow
          position={{
            lat: displayedExperience.lat,
            lng: displayedExperience.lng,
          }}
          onCloseClick={() => {
            setSelectedExperience(null);
            setHoveredExperience(null);
          }}
        >
          <div
            className="p-2 max-w-xs"
            onMouseLeave={() => {
              // Close InfoWindow when mouse leaves if not clicked
              if (!selectedExperience && hoveredExperience) {
                // Small delay to prevent accidental closes
                hoverTimeoutRef.current = setTimeout(() => {
                  setHoveredExperience(null);
                }, 150);
              }
            }}
            onMouseEnter={() => {
              // Cancel any pending close when mouse re-enters
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
            }}
          >
            {displayedExperience.images.length > 0 && (
              <Image
                src={displayedExperience.images[0].url}
                alt={displayedExperience.title}
                width={250}
                height={150}
                className="rounded-md object-cover mb-2 w-full h-32"
              />
            )}
            <h3 className="font-semibold text-base mb-1">
              {displayedExperience.title}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {displayedExperience.locationName}
            </p>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              {displayedExperience.description}
            </p>
            <div className="flex items-center gap-2 mb-2">
              {displayedExperience.user.image && (
                <Image
                  src={displayedExperience.user.image}
                  alt={displayedExperience.user.name || "User"}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
              <span className="text-xs text-gray-600">
                {displayedExperience.user.name || "Anonymous"}
              </span>
            </div>
            <Link
              href={`/experiences/${displayedExperience.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
