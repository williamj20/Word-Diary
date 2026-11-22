import SignupForm from '@/app/(public)/signup/components/signup-form';
import { redirectToDiaryIfLoggedIn } from '@/lib/auth';

const SignupPage = async () => {
  await redirectToDiaryIfLoggedIn();

  return (
    <main className="flex items-center justify-center">
      <SignupForm />
    </main>
  );
};

export default SignupPage;
