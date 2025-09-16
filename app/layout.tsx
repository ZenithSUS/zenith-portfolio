import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/ui/navbar";
import ModalProvider from "@/provider/modal";
import ToastProvider from "@/provider/toast";

export const metadata: Metadata = {
  title: "Jeran Christopher | Full Stack Developer",
  description:
    "This is Jeran Christopher's Portfolio Website a Solo Leveling Theme Website",
  keywords: [
    "Portfolio",
    "Solo Leveling",
    "Full Stack Developer",
    "Web Developer",
    "AI Developer",
    "Hire Me",
    "Jeran Christopher",
    "Jeran",
  ],
  authors: [
    {
      name: "Jeran Christopher",
      url: "https://github.com/ZenithSUS",
    },
  ],
  openGraph: {
    title: "Jeran Christopher | Full Stack Developer",
    description:
      "This is Jeran Christopher's Portfolio Website a Solo Leveling Theme Website",
    url: "https://jeranchristopher.vercel.app",
    siteName: "Jeran Christopher | Full Stack Developer",
    images: [
      {
        url: "https://jeranchristopher.vercel.app/images/hero.webp",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-text font-mono antialiased">
        <Navbar />
        <ModalProvider />
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
