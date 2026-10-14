import { requireSignedInProfile } from '@/app/lib/auth';
import { getCurrentUser } from '@/app/lib/utils';
import ProfileCard from '@/app/profile/components/profile-card';

const ProfilePage = async () => {
  const profile = await requireSignedInProfile();
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
