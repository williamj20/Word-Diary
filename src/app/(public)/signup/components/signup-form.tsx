'use client';

import { signup } from '@/app/lib/actions/auth';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useState } from 'react';

const SignupForm = () => {
  const [state, action] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(prev => !prev);

  return (
    <form action={action} className="auth-form">
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
            defaultValue={state?.fields?.email ?? ''}
          />
          {state?.errors?.email && (
            <p className="error-message">{state.errors.email}</p>
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
          {state?.errors?.password && (
            <div className="error-message">
              <p>Password must:</p>
              <ul className="list-disc list-inside ml-3">
                {state.errors.password.map(error => (
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
          {state?.errors?.confirmPassword && (
            <p className="error-message">{state.errors.confirmPassword}</p>
          )}
        </div>
        <button className="auth-submit-button">Sign Up</button>
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
