'use client';

import { login } from '@/app/lib/actions/auth';
import { Eye, EyeOff } from 'lucide-react';
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
        </div>
        {state?.errors && (
          <p className="error-message">Invalid login credentials.</p>
        )}
        <button className="auth-submit-button">Login</button>
      </div>
    </form>
  );
};

export default LoginForm;
