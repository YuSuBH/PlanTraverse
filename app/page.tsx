import React from "react";
import { Map as MapIcon, Globe, Calendar, Share2 } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";
import AuthButton from "@/components/auth-button";

//globe country visited

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-background py-20 md:py-32 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Plan Your Journey & <br className="hidden md:block" />
                <span className="text-muted-foreground">Share Your World</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
                Seamlessly organize your trips with detailed itineraries, or
                discover and share amazing travel experiences on our interactive
                globe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthButton
                  isLoggedIn={isLoggedIn}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-md transition-all duration-200 flex items-center justify-center text-lg font-medium"
                >
                  {isLoggedIn ? (
                    "Go to Planner"
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3.01.41 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.23 0 1.61-.02 2.91-.02 3.31 0 .32.22.69.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span className="ml-2">Log in to Plan</span>
                    </>
                  )}
                </AuthButton>
                <Link
                  href="/experiences"
                  className="w-full sm:w-auto bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground px-8 py-4 rounded-md transition-all duration-200 flex items-center justify-center font-medium text-lg"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Explore Map
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section 1: Trip Planning */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 tracking-tight">
                  Smart Trip Planning
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Build detailed day-by-day itineraries, organize destinations,
                  and manage your travel logistics in one intuitive interface.
                </p>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <div className="bg-secondary p-3 rounded-md h-fit">
                      <Calendar className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Day-by-Day Itineraries</h3>
                      <p className="text-muted-foreground">
                        Structure your trip perfectly.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-secondary p-3 rounded-md h-fit">
                      <MapIcon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Interactive Maps</h3>
                      <p className="text-muted-foreground">
                        Visualize your route clearly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-secondary rounded-xl h-80 flex items-center justify-center border border-border">
                <MapIcon className="w-24 h-24 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section 2: Experience Map */}
        <section className="py-16 md:py-24 bg-background border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 tracking-tight">
                  Interactive Experience Map
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Explore a global map filled with travel experiences. Pin your
                  own memories, upload photos, and inspire others.
                </p>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <div className="bg-secondary p-3 rounded-md h-fit">
                      <Globe className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Global Discovery</h3>
                      <p className="text-muted-foreground">
                        Find hidden gems around the world.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-secondary p-3 rounded-md h-fit">
                      <Share2 className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Share Memories</h3>
                      <p className="text-muted-foreground">
                        Post your travel highlights.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/experiences"
                    className="text-foreground font-medium hover:underline underline-offset-4"
                  >
                    Explore Experiences &rarr;
                  </Link>
                </div>
              </div>
              <div className="flex-1 bg-secondary rounded-xl h-80 flex items-center justify-center border border-border">
                <Globe className="w-24 h-24 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Ready to plan your next adventure?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who plan better trips with
              PlanTraverse.
            </p>
            <AuthButton
              isLoggedIn={isLoggedIn}
              className="inline-block bg-background text-foreground hover:bg-background/90 px-8 py-4 rounded-md transition-all duration-200 font-medium"
            >
              {isLoggedIn ? "Check it out" : "Sign Up Now"}
            </AuthButton>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}
