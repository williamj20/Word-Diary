'use client';

import { signup } from '@/app/lib/actions/auth';
import {
  getSignupErrors,
  type SignupErrors,
  type SignupFormState,
} from '@/app/lib/definitions';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const SignupForm = () => {
  const [errors, setErrors] = useState<SignupErrors>();
  const editedFields = useRef(new Set<string>());

  // Keep live errors visible while submitting, then replace them with action errors
  const submitSignup = async (
    previousState: SignupFormState,
    formData: FormData
  ) => {
    const nextState = await signup(previousState, formData);
    editedFields.current.add('password');
    editedFields.current.add('confirmPassword');
    editedFields.current.delete('email');
    setErrors(nextState?.errors);
    return nextState;
  };

  const [submittedState, action, isPending] = useActionState(
    submitSignup,
    undefined
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Debounce Zod validation and update errors only for edited fields
  const validate = useDebouncedCallback((form: HTMLFormElement) => {
    const formData = new FormData(form);
    const fields = {
      email: String(formData.get('email')),
      password: String(formData.get('password')),
      confirmPassword: String(formData.get('confirmPassword')),
    };
    const signupValidationErrors = Object.fromEntries(
      Object.entries(getSignupErrors(fields) ?? {}).filter(([field]) =>
        editedFields.current.has(field)
      )
    );
    const submittedEmailErrors = submittedState?.errors?.email;
    // Keep a submitted email error only until the user edits that email
    // After an edit, client validation takes over
    if (submittedEmailErrors && !editedFields.current.has('email')) {
      signupValidationErrors.email = submittedEmailErrors;
    }
    setErrors(signupValidationErrors);
  }, 700);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(prev => !prev);

  return (
    <form
      action={action}
      className="auth-form"
      onChange={event => {
        editedFields.current.add(event.target.name);
        validate(event.currentTarget);
      }}
      onSubmit={validate.cancel}
    >
      <div className="auth-form-fields">
        <div>
          <label className="form-input-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            id="email"
            name="email"
            type="email"
            defaultValue={submittedState?.fields?.email ?? ''}
            readOnly={isPending}
          />
          {errors?.email && (
            <p className="error-message mt-2">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="form-input-label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className="form-input"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              readOnly={isPending}
            />
            <button
              type="button"
              className="show-password-button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Reveal password'}
              title={showPassword ? 'Hide password' : 'Reveal password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
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
            Confirm Password
          </label>
          <div className="relative">
            <input
              className="form-input"
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              readOnly={isPending}
            />
            <button
              type="button"
              className="show-password-button"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Reveal password'
              }
              title={showConfirmPassword ? 'Hide password' : 'Reveal password'}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors?.confirmPassword && (
            <p className="error-message mt-2">{errors.confirmPassword}</p>
          )}
        </div>
        <button className="auth-submit-button" disabled={isPending}>
          Sign Up
        </button>
        <p className="auth-switch-text">
          Already have an account?{' '}
          <Link href="/login" className="auth-switch-link">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
