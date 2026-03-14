import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsureFlow DigitalEdge | Policy Administration for MGAs & Brokers",
  description:
    "Policy lifecycle management, underwriting, premium, payments, and compliance for MGAs and wholesale brokers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}