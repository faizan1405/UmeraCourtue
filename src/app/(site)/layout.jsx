import PublicLayout from '@/components/layout/PublicLayout';
import { getSettings } from '@/lib/data';

export const revalidate = 60;

export default async function SiteLayout({ children }) {
  const settings = await getSettings();

  return (
    <PublicLayout settings={settings}>
      {children}
    </PublicLayout>
  );
}
