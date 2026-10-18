import { getProfileByUsername } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/utils';
import ProfileCard from '@/app/profile/components/profile-card';
import { notFound, redirect } from 'next/navigation';

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const [profile, viewer] = await Promise.all([
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
    <main className="mx-auto w-full max-w-3xl">
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
