"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });
import { GlobeMethods } from "react-globe.gl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(
    new Set()
  );

  const [locations, setLocations] = useState<TransformedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/trips");
        const data = await response.json();
        setLocations(data);

        const countries = new Set<string>(
          data.map((loc: TransformedLocation) => loc.country)
        );

        setVisitedCountries(countries);
      } catch (err) {
        console.error("error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Your Travel Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Visualize your adventures across the globe and track the countries
              you've explored.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
              <div className="p-1">
                <div className="h-[600px] w-full relative rounded-xl overflow-hidden bg-black/5">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Globe
                      ref={globeRef}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                      backgroundColor="rgba(0,0,0,0)"
                      pointColor={() => "#000000"}
                      pointLabel="name"
                      pointsData={locations}
                      pointRadius={0.5}
                      pointAltitude={0.1}
                      pointsMerge={true}
                      width={800}
                      height={600}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-border shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Countries Visited</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-secondary/50 p-6 rounded-xl text-center">
                        <span className="text-5xl font-bold text-primary block mb-2">
                          {visitedCountries.size}
                        </span>
                        <p className="text-muted-foreground font-medium">
                          Countries Explored
                        </p>
                      </div>

                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {Array.from(visitedCountries).length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No countries visited yet.
                          </p>
                        ) : (
                          Array.from(visitedCountries)
                            .sort()
                            .map((country, key) => (
                              <div
                                key={key}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
                              >
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">{country}</span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
