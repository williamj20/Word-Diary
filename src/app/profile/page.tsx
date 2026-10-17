import { requireSignedInProfile } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const profile = await requireSignedInProfile();
  redirect(`/profile/${profile.username}`);
};

export default ProfilePage;
