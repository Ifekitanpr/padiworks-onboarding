import type { Metadata } from "next";
import { MotionShell } from "@/components/motion/motion-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Padiworks",
  description: "Padiworks account access",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MotionShell>{children}</MotionShell>
      </body>
    </html>
  );
}
