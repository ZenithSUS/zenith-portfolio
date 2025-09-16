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
