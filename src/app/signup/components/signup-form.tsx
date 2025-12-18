'use client';

import { signup } from '@/app/lib/actions/auth';
import { useActionState } from 'react';

const SignupForm = () => {
  const [state, action] = useActionState(signup, undefined);
  return (
    <form
      action={action}
      className="rounded-2xl shadow-md p-8 w-full max-w-md border border-stone-300"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            className="w-full px-4 py-2 border border-stone-300 rounded-lg"
            id="name"
            name="name"
            placeholder="Name"
          />
          {state?.errors?.name && (
            <p className="error-message">{state.errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            className="w-full px-4 py-2 border border-stone-300 rounded-lg"
            id="email"
            name="email"
            placeholder="Email"
          />
          {state?.errors?.email && (
            <p className="error-message">{state.errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-4 py-2 border border-stone-300 rounded-lg"
            id="password"
            name="password"
            type="password"
          />
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
        <button className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-stone-700">
          Sign Up
        </button>
      </div>
    </form>
  );
};
export default SignupForm;
