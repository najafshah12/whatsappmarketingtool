import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "WaStudio · WhatsApp Marketing", description: "WhatsApp Business campaign management" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

