import { getProfileByUsername } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';
import ProfileCard from '@/app/profile/components/profile-card';
import { notFound, redirect } from 'next/navigation';

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const [profile, { user: viewer }] = await Promise.all([
    getProfileByUsername(username),
    getCurrentUser(),
  ]);

  if (!profile) {
    notFound();
  }

  // For a matching username, normalize the URL to its stored lowercase spelling.
  if (username !== profile.username) {
    redirect(`/profile/${profile.username}`);
  }

  return (
    <main className="mx-auto w-full min-w-min max-w-3xl">
      {viewer?.id === profile.id ? (
        <ProfileCard
          isOwnProfile
          email={viewer.email ?? 'Email unavailable'}
          profile={profile}
        />
      ) : (
        <ProfileCard isOwnProfile={false} profile={profile} />
      )}
    </main>
  );
};

export default ProfilePage;
