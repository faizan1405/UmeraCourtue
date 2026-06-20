import CartClient from './CartClient';

export const metadata = {
  title: 'Your Bag | Umera Couture',
  description: 'Review your selected luxury fashion pieces and proceed to checkout.',
  openGraph: {
    title: 'Your Bag | Umera Couture',
    description: 'Review your selected luxury fashion pieces and proceed to checkout.',
  },
};

export default function CartPage() {
  return <CartClient />;
}
