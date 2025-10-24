import type { Metadata } from "next";
import { Urbanist, Patrick_Hand, Montserrat } from "next/font/google";
import "./globals.css";
import "./starry-background.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Khalid - Portfolio",
  description: "Creative Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} ${patrickHand.variable} ${montserrat.variable} font-patrick-hand antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
