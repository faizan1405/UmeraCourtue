import './globals.css';
import '@/components/admin/AdminLayout.css';

export const metadata = {
  title: 'Umera Couture | Luxury Fashion',
  description: 'Umera Couture - A celebration of timeless elegance, refined craftsmanship, and modern sophistication.',
  icons: {
    icon: '/umera-logo.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
