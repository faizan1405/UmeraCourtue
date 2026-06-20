import PublicLayout from '@/components/layout/PublicLayout';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const settings = await getSettings();

  return (
    <PublicLayout settings={settings}>
      {children}
    </PublicLayout>
  );
}
