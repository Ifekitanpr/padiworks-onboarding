import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Gilroy, as used throughout the Figma file. No SemiBold cut was supplied,
// so weight 600 is aliased to Bold (closer than Medium at this display size).
const gilroy = localFont({
  variable: "--font-geist-sans",
  src: [
    { path: "../fonts/Gilroy-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/Gilroy-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Gilroy-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Gilroy-Bold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Gilroy-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Gilroy-Heavy.ttf", weight: "800", style: "normal" },
    { path: "../fonts/Gilroy-Heavy.ttf", weight: "900", style: "normal" },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PadiworksAI",
  description: "AI-native Execution Intelligence Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${gilroy.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
