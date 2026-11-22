import type { SignupErrors } from '@/app/lib/auth-forms';

export const RECOVERY_ERROR = 'Something went wrong. Please try again.';

export const recoveryLinkMessages = {
  'invalid-link':
    'This reset link is invalid or has expired. Please request a new one.',
  'verification-unavailable':
    'Reset link verification is temporarily unavailable. Please wait a few minutes and reopen the link in your email, or request a new one below.',
} as const;

export type RecoveryLinkReason = keyof typeof recoveryLinkMessages;

export interface ForgotPasswordState {
  status: 'idle' | 'sent' | 'error';
  emailError?: string;
  message?: string;
}

export interface ResetPasswordState {
  success: boolean;
  errors?: Pick<SignupErrors, 'password' | 'confirmPassword'>;
  message?: string;
}
