import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FloatingAboutButton() {
  return (
    <Link href="/about" className="fixed bottom-6 right-6 z-50 group">
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-2xl transition-smooth hover-lift bg-gradient-primary hover:opacity-90"
        aria-label="About"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 transition-smooth group-hover:scale-110 group-hover:rotate-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </Button>
    </Link>
  );
}
