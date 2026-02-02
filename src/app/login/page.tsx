import createSupabaseServerClient from '@/app/lib/supabase/server';
import LoginForm from '@/app/login/components/login-form';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect('/');
  }
  return (
    <main className="flex items-center justify-center">
      <LoginForm />
    </main>
  );
};

export default LoginPage;
