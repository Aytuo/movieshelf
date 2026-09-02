import PersonCredits from '@/components/people/people-credits';
import PersonHeader from '@/components/people/people-header';
import { getPersonProfile } from '@/lib/services/people-service';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PersonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PersonPageProps): Promise<Metadata> {
  const { id } = await params;
  const personId = Number(id);

  if (!Number.isInteger(personId)) {
    return {};
  }

  const profile = await getPersonProfile(personId);

  if (!profile) {
    return {};
  }

  return {
    title: profile.person.name,
    description:
      profile.person.biography ??
      `${profile.person.name} filmography and credits.`,
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const personId = Number(id);

  if (!Number.isInteger(personId) || personId <= 0) {
    notFound();
  }

  const profile = await getPersonProfile(personId);

  if (!profile) {
    notFound();
  }

  return (
    <main>
      <PersonHeader person={profile.person} />
      <PersonCredits
        knownFor={profile.knownFor}
        acting={profile.acting}
        directing={profile.directing}
        writing={profile.writing}
        production={profile.production}
        otherCrew={profile.otherCrew}
      />
    </main>
  );
}
