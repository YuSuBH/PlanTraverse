"use client";

import { OverlayView, OverlayViewF } from "@react-google-maps/api";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { ExperienceWithDetails } from "@/types";

interface AdaptiveInfoWindowProps {
  experience: ExperienceWithDetails;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  map?: google.maps.Map | null;
}

export function AdaptiveInfoWindow({
  experience,
  onClose,
  onMouseEnter,
  onMouseLeave,
  map,
}: AdaptiveInfoWindowProps) {
  const [overlay, setOverlay] = useState<google.maps.OverlayView | null>(null);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const [xOffset, setXOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const onOverlayLoad = useCallback((overlayView: google.maps.OverlayView) => {
    setOverlay(overlayView);
  }, []);

  const markerPosition = useMemo(
    () => ({
      lat: experience.lat,
      lng: experience.lng,
    }),
    [experience.lat, experience.lng]
  );

  useEffect(() => {
    const listeners: google.maps.MapsEventListener[] = [];

    const updatePos = () => {
      if (!overlay) return;
      const projection = overlay.getProjection();
      if (!projection) return;

      const pixel = projection.fromLatLngToContainerPixel(
        new google.maps.LatLng(experience.lat, experience.lng)
      );

      // measure popover dimensions and map container dimensions
      const popupHeight = wrapperRef.current?.offsetHeight ?? 200;
      const popupWidth = wrapperRef.current?.offsetWidth ?? 260;
      const halfWidth = popupWidth / 2;
      const mapDiv = map?.getDiv();
      const mapHeight = mapDiv?.clientHeight ?? window.innerHeight;
      const mapWidth = mapDiv?.clientWidth ?? window.innerWidth;
      const margin = 16; // small margin

      // Vertical positioning
      if (pixel && pixel.y < popupHeight + margin) {
        setPosition("bottom");
      } else if (pixel && pixel.y > mapHeight - (popupHeight + margin)) {
        setPosition("top");
      } else {
        setPosition("top");
      }

      // Horizontal positioning
      let newXOffset = 0;
      if (pixel && pixel.x < halfWidth + margin) {
        // Too close to left edge -> shift right
        newXOffset = halfWidth + margin - pixel.x;
      } else if (pixel && pixel.x > mapWidth - (halfWidth + margin)) {
        // Too close to right edge -> shift left
        newXOffset = mapWidth - (halfWidth + margin) - pixel.x;
      }
      setXOffset(newXOffset);
      setIsVisible(true);
    };

    // initial calc
    updatePos();
    // Retry after a short delay to ensure projection is ready and layout is measured
    // This fixes the issue where the popup opens in the wrong position initially
    const timer = setTimeout(updatePos, 50);

    // listen to map events so position updates when user pans/zooms
    if (map) {
      listeners.push(map.addListener("idle", updatePos));
      listeners.push(map.addListener("bounds_changed", updatePos));
      listeners.push(map.addListener("zoom_changed", updatePos));
    }

    // also listen to window resize
    const onResize = () => updatePos();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      listeners.forEach((l) => l.remove());
      window.removeEventListener("resize", onResize);
    };
  }, [overlay, experience, map]);

  return (
    <OverlayViewF
      position={markerPosition}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      onLoad={onOverlayLoad}
    >
      <div
        ref={wrapperRef}
        className={`absolute bg-white rounded-md shadow-xl p-0 z-50 w-[260px] cursor-default
          ${position === "top" ? "bottom-full mb-3" : "top-full mt-3"}
          left-1/2
          transition-opacity duration-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }
        `}
        style={{
          transform: `translateX(calc(-50% + ${xOffset}px))`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 z-10 text-gray-500"
        >
          <X size={16} />
        </button>

        <div className="p-3">
          {experience.images.length > 0 && (
            <Image
              src={experience.images[0].url}
              alt={experience.title}
              width={250}
              height={150}
              className="rounded-md object-cover mb-2 w-full h-32"
            />
          )}
          <h3 className="font-semibold text-base mb-1">{experience.title}</h3>
          <p className="text-sm text-gray-600 mb-1">
            {experience.locationName}
          </p>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {experience.description}
          </p>
          <div className="flex items-center gap-2 mb-2">
            {experience.user.image && (
              <Image
                src={experience.user.image}
                alt={experience.user.name || "User"}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-gray-600">
              {experience.user.name || "Anonymous"}
            </span>
          </div>
          <Link
            href={`/experiences/${experience.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>

        {/* Arrow */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-8 border-transparent
          ${
            position === "top"
              ? "bottom-[-16px] border-t-white"
              : "top-[-16px] border-b-white"
          }
        `}
          style={{
            marginLeft: `${-xOffset}px`,
          }}
        />
      </div>
    </OverlayViewF>
  );
}
