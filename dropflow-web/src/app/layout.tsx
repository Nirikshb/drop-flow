import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Dropflow — File upload infrastructure for developers",
    template: "%s · Dropflow",
  },
  description:
    "Integrate reliable file uploads into your app with one SDK. Validation, direct-to-storage uploads, progress, asset management and usage tracking — in one place.",
  keywords: ["file upload", "asset management", " developer infrastructure", "R2", "SDK"],
  openGraph: {
    title: "Dropflow — File upload infrastructure for developers",
    description: "One SDK for uploads, assets and usage.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full">
        <TooltipProvider>
          {children}
          <Toaster richColors position="bottom-right" closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
