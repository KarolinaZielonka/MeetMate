import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { FloatingAboutButton } from "@/components/FloatingAboutButton";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MeetSync - Group Scheduling Made Simple",
  description:
    "Find time together, without the hassle. Modern group scheduling without account creation.",
  keywords: [
    "scheduling",
    "group availability",
    "meeting planner",
    "calendar",
    "coordination",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <FloatingAboutButton />
      </body>
    </html>
  );
}
