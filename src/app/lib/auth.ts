import { getCurrentProfile } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/utils';
import { redirect } from 'next/navigation';

// For public pages: allow signed-out visitors, but send signed-in users without
// a profile to onboarding. Returns the current profile, or null if signed out.
export const requireProfileIsCreatedIfLoggedIn = async () => {
  const profile = await getCurrentProfile();
  if (!profile && (await getCurrentUser())) {
    redirect('/onboarding/profile');
  }
  return profile;
};

// For protected pages: send signed-out visitors to signup and signed-in users
// without a profile to onboarding. Returns a profile if access is allowed.
export const requireSignedInProfile = async () => {
  const profile = await requireProfileIsCreatedIfLoggedIn();
  if (!profile) {
    redirect('/signup');
  }
  return profile;
};

// For login/signup pages: allow signed-out visitors to stay. Send signed-in
// users to their diary if they have a profile, or to onboarding otherwise.
export const redirectToDiaryIfLoggedIn = async () => {
  const profile = await requireProfileIsCreatedIfLoggedIn();
  if (profile) {
    redirect('/diary');
  }
};
