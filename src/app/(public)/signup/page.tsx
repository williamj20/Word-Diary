import SignupForm from '@/app/(public)/signup/components/signup-form';
import { redirectToDiaryIfLoggedIn } from '@/app/lib/utils';

const SignupPage = async () => {
  await redirectToDiaryIfLoggedIn();

  return (
    <main className="flex items-center justify-center">
      <SignupForm />
    </main>
  );
};

export default SignupPage;
