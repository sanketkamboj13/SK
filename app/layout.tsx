import "./globals.css";
import type { Metadata } from "next";
import { StoreProvider } from "./store";

export const metadata: Metadata = {
  title: "S.K — Modern Menswear",
  description: "Premium men's fashion by S.K.",
  openGraph: { title: "S.K — Modern Menswear", description: "Modern essentials designed for the way you move." }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><StoreProvider>{children}</StoreProvider></body></html>;
}
