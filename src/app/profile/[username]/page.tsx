import { getCurrentProfile, getProfilePageByUsername } from '@/lib/data';
import { getCurrentUser } from '@/lib/session';
import ProfileCard from '@/app/profile/components/profile-card';
import { notFound, redirect } from 'next/navigation';

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const [{ username }, { user: viewer }] = await Promise.all([
    params,
    getCurrentUser(),
  ]);

  const [profile, viewerProfile] = await Promise.all([
    getProfilePageByUsername(username, viewer?.id ?? null),
    getCurrentProfile(),
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
      <ProfileCard profile={profile} viewer={viewerProfile ? viewer : null} />
    </main>
  );
};

export default ProfilePage;
