import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Intellect Bulk Sender · Campaign Studio", description: "WhatsApp Business campaign management workspace" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
