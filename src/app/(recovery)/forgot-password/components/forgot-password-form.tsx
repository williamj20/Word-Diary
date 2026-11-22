'use client';

import { requestPasswordReset } from '@/lib/actions/password-recovery';
import {
  type ForgotPasswordState,
  RECOVERY_ERROR,
} from '@/lib/password-recovery';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';

const ForgotPasswordForm = ({ linkMessage }: { linkMessage?: string }) => {
  const [email, setEmail] = useState('');
  const [deadline, setDeadline] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const submit = async (
    previousState: ForgotPasswordState,
    formData: FormData
  ): Promise<ForgotPasswordState> => {
    try {
      const nextState = await requestPasswordReset(previousState, formData);
      if (nextState.status === 'sent') {
        setDeadline(Date.now() + 60_000);
        setRemainingSeconds(60);
        const url = new URL(window.location.href);
        url.searchParams.delete('reason');
        window.history.replaceState(null, '', url);
      }
      return nextState;
    } catch (error) {
      // A failed browser-to-action request never confirms that mail was sent.
      console.error('Password recovery request failed', error);
      return { status: 'error', message: RECOVERY_ERROR };
    }
  };

  const [state, action, isPending] = useActionState(submit, { status: 'idle' });

  useEffect(() => {
    if (!deadline) {
      return;
    }
    const updateCountdown = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSeconds(seconds);
      if (seconds === 0) {
        clearInterval(interval);
      }
    };
    const interval = setInterval(updateCountdown, 1000);

    // Background tabs can pause timers. Recompute from the deadline on return.
    document.addEventListener('visibilitychange', updateCountdown);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', updateCountdown);
    };
  }, [deadline]);

  return (
    <form
      action={action}
      className="auth-form"
      noValidate
      onSubmit={event => {
        if (isPending || Date.now() < deadline) {
          event.preventDefault();
        }
      }}
    >
      <div className="auth-form-fields">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Forgot password?
          </h2>
          <p className="mt-3 text-sm text-[var(--ink-muted)] sm:text-base">
            Enter your email to request a password reset link.
          </p>
        </div>
        {linkMessage && state.status === 'idle' && (
          <p className="error-message">{linkMessage}</p>
        )}
        <div>
          <label className="form-input-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            readOnly={isPending}
          />
          {state.emailError && (
            <p className="error-message mt-2">{state.emailError}</p>
          )}
        </div>
        {state.message && (
          <p
            className={
              state.status === 'sent'
                ? 'text-sm text-[var(--sage-dark)] sm:text-base'
                : 'error-message'
            }
          >
            {state.message}
          </p>
        )}
        <button
          disabled={isPending || remainingSeconds > 0}
          className="action-button action-button-primary w-full px-4 py-3 text-base"
        >
          {isPending
            ? 'Requesting link…'
            : remainingSeconds > 0
              ? `Resend in ${remainingSeconds}s`
              : deadline
                ? 'Resend reset link'
                : 'Send reset link'}
        </button>
        <p className="auth-switch-text">
          <Link href="/login" className="auth-switch-link">
            Back to log in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
