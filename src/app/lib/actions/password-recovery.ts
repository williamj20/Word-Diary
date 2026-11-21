'use server';

import { createClient } from '@supabase/supabase-js';
import { getEmailErrors, getPasswordErrors } from '@/app/lib/definitions';
import createSupabaseServerClient from '@/app/lib/supabase/server';
import {
  type ForgotPasswordState,
  type ResetPasswordState,
  RECOVERY_ERROR,
} from '@/app/lib/password-recovery';
import { logRecoveryError } from '@/app/lib/password-recovery-errors';

// These outcomes get the same response as an accepted request to keep account existence private.
const recipientErrorCodes = [
  'user_not_found',
  'over_email_send_rate_limit',
  'email_address_not_authorized',
  'email_address_invalid',
];

export const requestPasswordReset = async (
  _state: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> => {
  const email = String(formData.get('email') ?? '').trim();
  const emailError = getEmailErrors(email);
  if (emailError) {
    return { status: 'error', emailError };
  }

  // The recovery link contains its own token hash, so this request needs no verifier cookie.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    // Requesting a reset email creates no session, so skip the refresh timer.
    { auth: { autoRefreshToken: false } }
  );

  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    logRecoveryError('request', error);
    if (!recipientErrorCodes.includes(error.code ?? '')) {
      return { status: 'error', message: RECOVERY_ERROR };
    }
  }
  return {
    status: 'sent',
    message:
      'If an account exists for this email, check your inbox for a password reset link.',
  };
};

export const resetPassword = async (
  expectedUserId: string,
  formData: FormData
): Promise<ResetPasswordState> => {
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  const errors = getPasswordErrors({ password, confirmPassword });
  if (errors) {
    return { success: false, errors };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !data.user || data.user.id !== expectedUserId) {
    logRecoveryError(
      'session',
      sessionError ??
        new Error('The current user does not match the password reset form.')
    );
    return { success: false, message: RECOVERY_ERROR };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    logRecoveryError('update', error);
    return {
      success: false,
      message:
        error.code === 'same_password'
          ? 'Password must be different from your current password.'
          : RECOVERY_ERROR,
    };
  }
  return { success: true };
};
