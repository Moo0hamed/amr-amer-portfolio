import type { Metadata } from "next";
import "./globals.css";
import "./neo.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Amr Amer — Interior Designer",
    template: "%s — Amr Amer"
  },
  description:
    "A considered interior design portfolio for Amr Amer, focused on residential interiors, kitchens, dressing rooms and 3D visualisation.",
  keywords: ["Amr Amer", "interior designer", "مصمم داخلي", "interior architecture", "3D visualisation"],
  authors: [{ name: "Amr Amer" }],
  openGraph: {
    title: "Amr Amer — Interior Designer",
    description: "Residential interiors shaped around how people live.",
    type: "website",
    locale: "ar_EG"
  },
  twitter: {
    card: "summary_large_image",
    title: "Amr Amer — Interior Designer",
    description: "Residential interiors shaped around how people live."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
