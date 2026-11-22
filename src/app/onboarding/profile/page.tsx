import AppHeader from '@/components/app-header';
import ProfileForm from '@/components/profile-form';
import { getCurrentProfile } from '@/lib/data';
import { redirectToSignupIfNotLoggedIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

const ProfileSetupPage = async () => {
  await redirectToSignupIfNotLoggedIn();
  const profile = await getCurrentProfile();
  if (profile) {
    redirect('/diary');
  }

  return (
    <>
      <AppHeader showAuthenticatedControls={false} />
      <main className="mx-auto w-full min-w-min max-w-3xl pb-8">
        <ProfileForm />
      </main>
    </>
  );
};

export default ProfileSetupPage;
