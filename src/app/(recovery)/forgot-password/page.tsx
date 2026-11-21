import ForgotPasswordForm from '@/app/(recovery)/forgot-password/components/forgot-password-form';
import { recoveryLinkMessages } from '@/app/lib/password-recovery';

const ForgotPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string | string[] }>;
}) => {
  const { reason } = await searchParams;
  const message =
    reason === 'invalid-link' || reason === 'verification-unavailable'
      ? recoveryLinkMessages[reason]
      : undefined;

  return <ForgotPasswordForm linkMessage={message} />;
};

export default ForgotPasswordPage;
