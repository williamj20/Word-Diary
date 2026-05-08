import { logout } from '@/app/lib/actions/auth';
import { getCurrentUser } from '@/app/lib/utils';

const AuthButtons = async () => {
  const user = await getCurrentUser();
  if (user) {
    return (
      <form action={logout}>
        <button type="submit" className="auth-button">
          Sign Out
        </button>
      </form>
    );
  }
};

export default AuthButtons;
