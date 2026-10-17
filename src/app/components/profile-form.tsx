'use client';

import { LogOut, Pencil, Save, UserRound, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';

import { logout } from '@/app/lib/actions/auth';
import {
  createCurrentProfile,
  updateCurrentProfile,
} from '@/app/lib/actions/profile';
import {
  CurrentProfile,
  ProfileFormFields,
  ProfileFormState,
} from '@/app/lib/definitions';

const FieldErrors = ({ errors }: { errors?: string[] }) => {
  if (!errors) {
    return null;
  }

  return (
    <ul className="error-message mt-2 list-inside list-disc">
      {errors.map(error => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
};

const ProfileForm = ({ profile }: { profile?: CurrentProfile }) => {
  const router = useRouter();
  const isCreating = !profile;
  const initialFields = profile ?? { displayName: '', username: '' };
  const initialState: ProfileFormState = {
    fields: initialFields,
  };
  const [draftFields, setDraftFields] =
    useState<ProfileFormFields>(initialFields);
  const [state, action, isPending] = useActionState(
    isCreating ? createCurrentProfile : updateCurrentProfile,
    initialState
  );

  return (
    <section className="profile-panel">
      <div className="profile-panel-header px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="profile-panel-icon">
            {isCreating ? (
              <UserRound className="h-5 w-5" />
            ) : (
              <Pencil className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">
              {isCreating ? 'Create your profile' : 'Edit your profile'}
            </h2>
          </div>
        </div>
      </div>

      <form action={action} className="p-5 sm:p-8">
        {isCreating && (
          <p className="mb-6 text-sm text-[var(--ink-muted)] sm:text-base">
            Choose a name and username to make your diary your own.
          </p>
        )}
        <div className="flex flex-col gap-5">
          <div>
            <label className="form-input-label" htmlFor="username">
              Username
            </label>
            <input
              className="form-input"
              id="username"
              name="username"
              type="text"
              required
              minLength={3}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={30}
              value={draftFields.username}
              onChange={event =>
                setDraftFields(currentFields => ({
                  ...currentFields,
                  username: event.target.value,
                }))
              }
              readOnly={isPending}
            />
            <p className="mt-2 text-xs text-[var(--ink-muted)] sm:text-sm">
              Use 3–30 letters, numbers, or underscores. Spaces are not allowed.
            </p>
            <FieldErrors errors={state.errors?.username} />
          </div>

          <div>
            <label className="form-input-label" htmlFor="displayName">
              Display Name
            </label>
            <input
              className="form-input"
              id="displayName"
              name="displayName"
              type="text"
              required
              autoComplete="nickname"
              maxLength={80}
              value={draftFields.displayName}
              onChange={event =>
                setDraftFields(currentFields => ({
                  ...currentFields,
                  displayName: event.target.value,
                }))
              }
              readOnly={isPending}
            />
            <p className="mt-2 text-xs text-[var(--ink-muted)] sm:text-sm">
              The name shown at the top of your profile.
            </p>
            <FieldErrors errors={state.errors?.displayName} />
          </div>

          {state.message && (
            <p className="error-message rounded-2xl border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3">
              {state.message}
            </p>
          )}

          <div className="mt-3 flex flex-col items-end gap-3 sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isPending}
              className="action-button action-button-primary"
            >
              <Save />
              {isPending ? 'Saving...' : isCreating ? 'Create profile' : 'Save'}
            </button>
            {isCreating ? (
              <button
                type="submit"
                formAction={logout}
                formNoValidate
                disabled={isPending}
                className="action-button action-button-secondary"
              >
                <LogOut />
                Sign out
              </button>
            ) : (
              <button
                type="button"
                disabled={isPending}
                onClick={() => router.replace(`/profile/${profile.username}`)}
                className="action-button action-button-secondary"
              >
                <X />
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProfileForm;
