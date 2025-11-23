import React from "react";
import { Map as MapIcon, Globe, Calendar, Share2 } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";
import AuthButton from "@/components/auth-button";
// Now first analyze the entire codebase and understand the ui implementation and overhaul the entire website ui. Keep the minimilast design with black and white theme and add any complementing colors if needed. Maintain consistant ui design across site.

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-gray-50 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Plan Your Journey & <br className="hidden md:block" />
                <span className="text-gray-900">Share Your World</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Seamlessly organize your trips with detailed itineraries, or
                discover and share amazing travel experiences on our interactive
                globe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthButton
                  isLoggedIn={isLoggedIn}
                  className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoggedIn ? (
                    "Go to Planner"
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6"
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
                  className="w-full sm:w-auto bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center font-medium"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Explore Map
                </Link>
              </div>
            </div>
          </div>
          {/* Decorative Clipped Background at the Bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 bg-white"
            style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}
          />
        </section>

        {/* Feature Section 1: Trip Planning */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">Smart Trip Planning</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Build detailed day-by-day itineraries, organize destinations,
                  and manage your travel logistics in one intuitive interface.
                </p>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <div className="bg-gray-100 p-3 rounded-full h-fit">
                      <Calendar className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Day-by-Day Itineraries</h3>
                      <p className="text-gray-600">
                        Structure your trip perfectly.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-gray-100 p-3 rounded-full h-fit">
                      <MapIcon className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Interactive Maps</h3>
                      <p className="text-gray-600">
                        Visualize your route clearly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
                <MapIcon className="w-24 h-24 text-gray-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section 2: Experience Map */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">
                  Interactive Experience Map
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Explore a global map filled with travel experiences. Pin your
                  own memories, upload photos, and inspire others.
                </p>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <div className="bg-gray-100 p-3 rounded-full h-fit">
                      <Globe className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Global Discovery</h3>
                      <p className="text-gray-600">
                        Find hidden gems around the world.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-gray-100 p-3 rounded-full h-fit">
                      <Share2 className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Share Memories</h3>
                      <p className="text-gray-600">
                        Post your travel highlights.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/experiences"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    Explore Experiences &rarr;
                  </Link>
                </div>
              </div>
              <div className="flex-1 bg-gray-200 rounded-2xl h-80 flex items-center justify-center">
                <Globe className="w-24 h-24 text-gray-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to plan your next adventure?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who plan better trips with
              PlanTraverse.
            </p>
            <AuthButton
              isLoggedIn={isLoggedIn}
              className="inline-block bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg transition-colors duration-200"
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
