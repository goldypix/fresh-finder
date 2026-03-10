import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fresh Finder — Find the Cheapest Groceries Near You",
  description:
    "Compare grocery prices across Woolworths, Coles, and Aldi. Find the best deals on fresh food in Australia.",
  openGraph: {
    title: "Fresh Finder — Find the Cheapest Groceries Near You",
    description:
      "Compare grocery prices across Woolworths, Coles, and Aldi. Find the best deals on fresh food in Australia.",
    url: "https://freshfinder.com.au",
    siteName: "Fresh Finder",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Fresh Finder — Find the Cheapest Groceries Near You",
    description:
      "Compare grocery prices across Woolworths, Coles, and Aldi. Find the best deals on fresh food in Australia.",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
