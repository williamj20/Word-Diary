import { redirectToHomeIfLoggedIn } from '@/app/lib/utils';
import SignupForm from '@/app/signup/components/signup-form';

const SignupPage = async () => {
  await redirectToHomeIfLoggedIn();
  return (
    <main className="flex items-center justify-center">
      <SignupForm />
    </main>
  );
};

export default SignupPage;
