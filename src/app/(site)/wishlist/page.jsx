import WishlistClient from './WishlistClient';

export const metadata = {
  title: 'Your Wishlist | Umera Couture',
  description: 'View your saved luxury fashion items and select them for details or enquiry.',
  openGraph: {
    title: 'Your Wishlist | Umera Couture',
    description: 'View your saved luxury fashion items and select them for details or enquiry.',
  },
};

export default function WishlistPage() {
  return <WishlistClient />;
}
