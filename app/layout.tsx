import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar"; // <-- BRINGING YOUR NAVBAR BACK!

// Load our new premium bakery fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "FreshBakes | Artisan Bakery",
  description: "Morning cravings, cured.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${caveat.variable} font-sans bg-stone-50 text-stone-900`}>
        <CartProvider>
          <Navbar /> {/* <-- RESTORING IT TO THE SCREEN */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}