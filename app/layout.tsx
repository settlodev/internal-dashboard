import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Settlo Internal Dashboard",
  description: "Settlo Internal Dashboard",
  generator: "Settlo",
  icons: "/favicon.png",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='p-2 antialiased'
      >
       <main> {children}</main>
       <Toaster position="top-right"/>
        <Footer />
      </body>
      
    </html>
  );
}
