import { logout } from '@/app/lib/actions/auth';
import createSupabaseServerClient from '@/app/lib/supabase/server';
import Link from 'next/link';

const AuthButtons = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Logged OUT
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

  // Logged IN
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
