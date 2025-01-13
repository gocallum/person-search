//page.tsx
import UserSearch from './components/user-search';
import { TechnicalOverview } from './components/technical-overview';
import { UserDialog } from './components/user-dialog';

export default async function Home({ searchParams }: { searchParams: Promise<{ userId?: string }> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="container mx-auto px-4 py-8">
      <UserSearch searchParams={resolvedSearchParams} />
      <UserDialog />
      <TechnicalOverview />

    </div>
  );
}