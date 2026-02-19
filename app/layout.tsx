import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/Providers/AuthProvider";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juhudi",
  description: "Track your goals and stay motivated with daily reminders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className={bricolage.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
