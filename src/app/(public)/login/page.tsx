import LoginForm from '@/app/(public)/login/components/login-form';
import { redirectToDiaryIfLoggedIn } from '@/app/lib/utils';

const LoginPage = async () => {
  await redirectToDiaryIfLoggedIn();

  return (
    <main className="flex items-center justify-center">
      <LoginForm />
    </main>
  );
};

export default LoginPage;
