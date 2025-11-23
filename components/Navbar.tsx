"use client";

import { login, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <span className="text-xl font-bold tracking-tight">PlanTraverse</span>
        </Link>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link
                  href={"/trips"}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  My Trips
                </Link>
                <Link
                  href={"/experiences"}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Experiences
                </Link>
                <Link
                  href={"/experiences/my"}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  My Experiences
                </Link>
                <Link
                  href={"/globe"}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Globe
                </Link>
              </nav>

              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                onClick={logout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href={"/experiences"}
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block"
              >
                Experiences
              </Link>
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                onClick={login}
              >
                Sign In
                <svg
                  className="w-4 h-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3.01.41 2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.23 0 1.61-.02 2.91-.02 3.31 0 .32.22.69.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
