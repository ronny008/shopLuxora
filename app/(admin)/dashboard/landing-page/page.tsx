import { api } from '@/lib/services/api';
import { LandingPageEditorClient } from '@/components/admin/LandingPageEditorClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLandingPageEditor() {
  const landingConfig = await api.landingPage.get();

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <LandingPageEditorClient initialConfig={landingConfig} />
    </div>
  );
}
