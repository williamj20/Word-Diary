import { requireSignedInProfile } from '@/lib/auth';
import ProfileForm from '@/components/profile-form';

const EditProfilePage = async () => {
  const profile = await requireSignedInProfile();

  return (
    <main className="mx-auto w-full min-w-min max-w-3xl">
      <ProfileForm profile={profile} />
    </main>
  );
};

export default EditProfilePage;
