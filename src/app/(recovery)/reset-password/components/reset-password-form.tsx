'use client';

import { resetPassword } from '@/app/lib/actions/password-recovery';
import { getPasswordErrors } from '@/app/lib/auth-forms';
import {
  type ResetPasswordState,
  RECOVERY_ERROR,
} from '@/app/lib/password-recovery';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const ResetPasswordForm = ({ expectedUserId }: { expectedUserId: string }) => {
  const [errors, setErrors] = useState<ResetPasswordState['errors']>();
  const editedFields = useRef(new Set<string>());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = async (
    _previousState: ResetPasswordState,
    formData: FormData
  ): Promise<ResetPasswordState> => {
    try {
      const nextState = await resetPassword(expectedUserId, formData);
      setErrors(nextState.errors);
      if (nextState.success) {
        setPassword('');
        setConfirmPassword('');
      }
      return nextState;
    } catch (error) {
      // The mutation may have reached the server. Let the user retry explicitly.
      console.error('Password recovery update failed', error);
      return { success: false, message: RECOVERY_ERROR };
    }
  };

  const [state, action, isPending] = useActionState(submit, { success: false });

  const validate = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const fields = {
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };
    const passwordValidationErrors = Object.fromEntries(
      Object.entries(getPasswordErrors(fields) ?? {}).filter(([field]) =>
        editedFields.current.has(field)
      )
    );
    setErrors(passwordValidationErrors);
    return passwordValidationErrors;
  };

  const validateWhileTyping = useDebouncedCallback(validate, 700);

  if (state.success) {
    return (
      <section className="auth-form">
        <h2 className="text-2xl font-semibold sm:text-3xl">Password updated</h2>
        <p className="mt-3 text-sm text-[var(--ink-muted)] sm:text-base">
          Your password has been changed. You’re signed in and ready to
          continue.
        </p>
        <Link
          href="/diary"
          className="action-button action-button-primary mt-5"
        >
          Continue
        </Link>
      </section>
    );
  }

  return (
    <form
      action={action}
      className="auth-form"
      noValidate
      onChange={event => {
        editedFields.current.add(event.target.name);
        validateWhileTyping(event.currentTarget);
      }}
      onSubmit={event => {
        validateWhileTyping.cancel();
        editedFields.current = new Set(['password', 'confirmPassword']);
        if (
          isPending ||
          Object.keys(validate(event.currentTarget)).length > 0
        ) {
          event.preventDefault();
        }
      }}
    >
      <div className="auth-form-fields">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">Reset password</h2>
          <p className="mt-3 text-sm text-[var(--ink-muted)] sm:text-base">
            Use at least 8 characters, including a letter, a number, and a
            special character.
          </p>
        </div>
        <div>
          <label className="form-input-label" htmlFor="password">
            New password
          </label>
          <div className="relative">
            <input
              className="form-input pr-12"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              readOnly={isPending}
            />
            <button
              type="button"
              className="show-password-button"
              onClick={() => setShowPassword(value => !value)}
              title={showPassword ? 'Hide password' : 'Reveal password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors?.password && (
            <div className="error-message mt-2">
              <p>Password must:</p>
              <ul className="list-disc list-inside ml-3">
                {errors.password.map(error => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <label className="form-input-label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <div className="relative">
            <input
              className="form-input pr-12"
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              readOnly={isPending}
            />
            <button
              type="button"
              className="show-password-button"
              onClick={() => setShowConfirmPassword(value => !value)}
              title={showConfirmPassword ? 'Hide password' : 'Reveal password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors?.confirmPassword && (
            <p className="error-message mt-2">{errors.confirmPassword}</p>
          )}
        </div>
        {state.message && <p className="error-message">{state.message}</p>}
        <button
          disabled={isPending}
          className="action-button action-button-primary w-full px-4 py-3 text-base"
        >
          {isPending ? 'Updating password…' : 'Update password'}
        </button>
        {state.message === RECOVERY_ERROR && (
          <Link
            href="/forgot-password"
            className="auth-switch-link text-sm sm:text-base"
          >
            Request a new reset link
          </Link>
        )}
      </div>
    </form>
  );
};

export default ResetPasswordForm;
