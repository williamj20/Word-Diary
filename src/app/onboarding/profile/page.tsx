import AppHeader from '@/app/components/app-header';
import ProfileForm from '@/app/components/profile-form';
import { getCurrentProfile } from '@/app/lib/data';
import { redirectToSignupIfNotLoggedIn } from '@/app/lib/utils';
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
      <main className="mx-auto w-full max-w-3xl pb-8">
        <ProfileForm />
      </main>
    </>
  );
};

export default ProfileSetupPage;
