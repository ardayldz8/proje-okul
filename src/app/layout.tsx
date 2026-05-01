import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Test Platformu",
  description: "Ogrenciler icin online test, hocalar icin soru ve sonuc yonetimi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
