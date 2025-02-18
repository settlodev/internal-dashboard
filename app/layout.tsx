import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='antialiased'
      >
       <main> {children}</main>
       <Toaster position="top-right"/>
        <Footer />
      </body>
      
    </html>
  );
}
