import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md transition-smooth group-hover:shadow-lg group-hover:scale-105">
            <svg
              className="w-5 h-5 text-white transition-smooth group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#0047AB] to-[#003d99] bg-clip-text text-transparent transition-smooth group-hover:from-[#003d99] group-hover:to-[#003380]">
            MeetSync
          </span>
        </Link>

        {/* Desktop CTA */}
        <div className="hidden sm:block">
          <Button
            asChild
            size="sm"
            className="bg-gradient-primary hover:opacity-90 shadow-md hover:shadow-lg hover-lift"
          >
            <Link href="/create">
              Create Event
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
