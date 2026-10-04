import { getCurrentProfile } from '@/app/lib/data';
import { redirectToSignupIfNotLoggedIn } from '@/app/lib/utils';
import ProfileEditForm from '@/app/profile/components/profile-edit-form';

const EditProfilePage = async () => {
  await redirectToSignupIfNotLoggedIn();
  const profile = await getCurrentProfile();

  return (
    <main className="mx-auto w-full max-w-3xl">
      <ProfileEditForm profile={profile} />
    </main>
  );
};

export default EditProfilePage;
