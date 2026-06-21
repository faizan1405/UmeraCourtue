import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import '@/components/admin/AdminLayout.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Umera Couture | Luxury Fashion',
  description: 'Umera Couture - A celebration of timeless elegance, refined craftsmanship, and modern sophistication.',
  icons: {
    icon: '/umera-logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
