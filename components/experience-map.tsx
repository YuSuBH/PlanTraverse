"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useRef, useMemo } from "react";
import { ExperienceWithDetails } from "@/types";
import { AdaptiveInfoWindow } from "./adaptive-info-window";

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
  const mapRef = useRef<google.maps.Map | null>(null);

  // Show either clicked or hovered experience (clicked takes priority)
  const displayedExperience = selectedExperience || hoveredExperience;

  const center = useMemo(() => {
    return experiences.length > 0
      ? { lat: experiences[0].lat, lng: experiences[0].lng }
      : { lat: 0, lng: 0 };
  }, [experiences]);

  const mapContainerStyle = useMemo(
    () => ({ width: "100%", height: "100%" }),
    []
  );

  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={3}
      center={center}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      onUnmount={() => {
        mapRef.current = null;
      }}
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
        <AdaptiveInfoWindow
          key={displayedExperience.id}
          experience={displayedExperience}
          map={mapRef.current}
          onClose={() => {
            setSelectedExperience(null);
            setHoveredExperience(null);
          }}
          onMouseEnter={() => {
            // Cancel any pending close when mouse re-enters
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            // Close InfoWindow when mouse leaves if not clicked
            if (!selectedExperience && hoveredExperience) {
              // Small delay to prevent accidental closes
              hoverTimeoutRef.current = setTimeout(() => {
                setHoveredExperience(null);
              }, 150);
            }
          }}
        />
      )}
    </GoogleMap>
  );
}
