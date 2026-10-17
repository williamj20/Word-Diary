import { requireSignedInProfile } from '@/app/lib/auth';
import { getCurrentUser } from '@/app/lib/utils';
import ProfileCard from '@/app/profile/components/profile-card';
import { notFound, redirect } from 'next/navigation';

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const profile = await requireSignedInProfile();

  // Only allow the signed-in user's profile, ignoring username capitalization.
  if (username.toLowerCase() !== profile.username) {
    notFound();
  }

  // For a matching username, normalize the URL to its stored lowercase spelling.
  if (username !== profile.username) {
    redirect(`/profile/${profile.username}`);
  }

  // Email belongs to Supabase Auth rather than the profile table.
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-3xl">
      <ProfileCard
        email={user?.email ?? 'Email unavailable'}
        profile={profile}
      />
    </main>
  );
};

export default ProfilePage;
