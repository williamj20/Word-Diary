'use client';

import { login } from '@/app/lib/actions/auth';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useState } from 'react';

const LoginForm = () => {
  const [state, action] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

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
        </div>
        <div>
          <label className="form-input-label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className="form-input pr-12"
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
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {state?.errors && (
          <p className="error-message mt-2">Invalid login credentials.</p>
        )}
        <button className="action-button action-button-primary w-full px-4 py-3 text-base">
          Log In
        </button>
        <p className="auth-switch-text">
          Need to create an account?{' '}
          <Link href="/signup" className="auth-switch-link">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
