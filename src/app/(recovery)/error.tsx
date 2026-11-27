'use client';

import type { ErrorInfo } from 'next/error';
import { RECOVERY_ERROR } from '@/lib/password-recovery';
import Link from 'next/link';

const RecoveryError = ({ retry }: ErrorInfo) => (
  <section className="auth-form text-center">
    <h2 className="text-2xl font-semibold sm:text-3xl">
      Password recovery is unavailable
    </h2>
    <p className="mt-3 text-sm text-[var(--ink-muted)] sm:text-base">
      {RECOVERY_ERROR}
    </p>
    <button
      type="button"
      onClick={retry}
      className="action-button action-button-primary mt-5"
    >
      Try Again
    </button>
    <p className="auth-switch-text mt-4">
      <Link href="/forgot-password" className="auth-switch-link">
        Request a new reset link
      </Link>
    </p>
  </section>
);

export default RecoveryError;
