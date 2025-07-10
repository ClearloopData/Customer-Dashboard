import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

//the following code wraps each page in the app with shared things like 
// authorization info (i.e. globally shares which user is logged in), as 
// well as styling info like fonts, etc

const inter = Inter({ subsets: ['latin'] });

//font info
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

//font info
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//metadata
export const metadata = {
  title: 'CarbonDataApp',
  description: 'Your app description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}