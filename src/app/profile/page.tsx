import { getCurrentProfile } from '@/app/lib/data';
import { redirectToSignupIfNotLoggedIn } from '@/app/lib/utils';
import ProfileCard from '@/app/profile/components/profile-card';

const ProfilePage = async () => {
  const user = await redirectToSignupIfNotLoggedIn();
  const profile = await getCurrentProfile();

  return (
    <main className="mx-auto w-full max-w-3xl">
      <ProfileCard
        email={user.email ?? 'Email unavailable'}
        profile={profile}
      />
    </main>
  );
};

export default ProfilePage;
