import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; // Font isimlerin farklı olabilir, onlara dokunma
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Fruit E-commerce",
  description: "The freshest fruits you can find!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}