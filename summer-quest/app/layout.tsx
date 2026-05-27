import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Summer Quest",
  description: "Ứng dụng học hè local-first cho gia đình",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
