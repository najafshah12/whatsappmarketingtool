import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "RBS · Business Workspace", description: "RBS business workspace" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
