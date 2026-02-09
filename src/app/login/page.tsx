import { redirectToHomeIfLoggedIn } from '@/app/lib/utils';
import LoginForm from '@/app/login/components/login-form';

const LoginPage = async () => {
  await redirectToHomeIfLoggedIn();
  return (
    <main className="flex items-center justify-center">
      <LoginForm />
    </main>
  );
};

export default LoginPage;
