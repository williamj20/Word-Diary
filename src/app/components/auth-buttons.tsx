import { logout } from '@/app/lib/actions/auth';
import { getCurrentUser } from '@/app/lib/utils';
import Link from 'next/link';

const AuthButtons = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex gap-3">
        <Link
          href="/login"
          className="text-sm px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="text-sm px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition"
      >
        Sign out
      </button>
    </form>
  );
};

export default AuthButtons;
