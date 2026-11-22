import type { RecoveryLinkReason } from '@/lib/password-recovery';
import { logRecoveryError } from '@/lib/password-recovery-errors';
import createSupabaseServerClient from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const redirectTo = request.nextUrl.clone();
  const headers = { 'Cache-Control': 'private, no-store' };

  const redirectToPath = (pathname: string, reason?: RecoveryLinkReason) => {
    redirectTo.pathname = pathname;
    redirectTo.search = '';
    if (reason) {
      redirectTo.searchParams.set('reason', reason);
    }
    return NextResponse.redirect(redirectTo, { headers });
  };

  if (tokenHash && type === 'recovery') {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      logRecoveryError('verify', error);
      const reason =
        error.code === 'otp_expired'
          ? 'invalid-link'
          : 'verification-unavailable';
      return redirectToPath('/forgot-password', reason);
    }

    return redirectToPath('/reset-password');
  }

  return redirectToPath('/forgot-password', 'invalid-link');
};
