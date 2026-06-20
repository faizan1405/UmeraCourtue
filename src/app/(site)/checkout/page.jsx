import CheckoutClient from './CheckoutClient';

export const metadata = {
  title: 'Checkout | Umera Couture',
  description: 'Provide your delivery details and finalize your secure payment or manual transfer.',
  openGraph: {
    title: 'Checkout | Umera Couture',
    description: 'Provide your delivery details and finalize your secure payment or manual transfer.',
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
