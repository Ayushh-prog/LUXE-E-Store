import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUXU E-STORE | Discover Fashion. Give Back.',
  description: 'LUXU E-STORE is a modern, social-impact fashion marketplace connecting conscious shoppers, boutique sellers, and verified NGO clothing donation networks.',
  openGraph: {
    title: 'LUXU E-STORE | Premium Fashion & Social Impact Marketplace',
    description: 'Discover fashion you love while creating a second life for clothing through verified NGO donation drives.',
    url: 'https://luxu-estore.demo',
    siteName: 'LUXU E-STORE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#FFF8EC] text-[#241B29] min-h-screen flex flex-col antialiased selection:bg-[#E9DDF0] selection:text-[#432457]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
