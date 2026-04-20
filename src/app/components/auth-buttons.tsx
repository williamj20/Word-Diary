import { logout } from '@/app/lib/actions/auth';
import { getCurrentUser } from '@/app/lib/utils';
import Link from 'next/link';

const AuthButtons = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex gap-3">
        <Link href="/login" className="auth-button">
          Login
        </Link>
        <Link href="/signup" className="auth-button">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <form action={logout}>
      <button type="submit" className="auth-button">
        Sign out
      </button>
    </form>
  );
};

export default AuthButtons;
