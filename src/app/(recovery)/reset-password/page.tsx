import ResetPasswordForm from '@/app/(recovery)/reset-password/components/reset-password-form';
import { getCurrentUser } from '@/app/lib/session';
import { logRecoveryError } from '@/app/lib/password-recovery-errors';

export const dynamic = 'force-dynamic';

const ResetPasswordPage = async () => {
  const { user, error } = await getCurrentUser();
  if (error || !user) {
    const sessionError =
      error ??
      new Error('No authenticated user available for password recovery.');
    logRecoveryError('session', sessionError);

    // Let the recovery error boundary in (recovery)/error.tsx handle this error.
    throw sessionError;
  }
  return <ResetPasswordForm key={user.id} expectedUserId={user.id} />;
};

export default ResetPasswordPage;
