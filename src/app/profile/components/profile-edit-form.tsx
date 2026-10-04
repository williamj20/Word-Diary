'use client';

import { useActionState, useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { updateCurrentProfile } from '@/app/lib/actions/profile';
import {
  CurrentProfile,
  ProfileFormFields,
  ProfileFormState,
} from '@/app/lib/definitions';

const getFieldsFromProfile = (profile: CurrentProfile): ProfileFormFields => ({
  displayName: profile.displayName ?? '',
  username: profile.username ?? '',
});

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

const ProfileEditForm = ({ profile }: { profile: CurrentProfile }) => {
  const router = useRouter();
  const initialFields = getFieldsFromProfile(profile);
  const initialState: ProfileFormState = {
    fields: initialFields,
  };
  const [draftFields, setDraftFields] =
    useState<ProfileFormFields>(initialFields);
  const [state, action, isPending] = useActionState(
    updateCurrentProfile,
    initialState
  );

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)]">
      <div className="border-b border-[var(--brass)] bg-[var(--sage-soft)] px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--sage)] bg-[var(--paper-card)] text-[var(--sage-dark)] shadow-sm">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">
              Edit your profile
            </h2>
          </div>
        </div>
      </div>

      <form action={action} className="p-5 sm:p-8">
        <div className="flex flex-col gap-5">
          <div>
            <label className="form-input-label" htmlFor="displayName">
              Display Name <span className="normal-case">(optional)</span>
            </label>
            <input
              className="form-input"
              id="displayName"
              name="displayName"
              type="text"
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

          <div>
            <label className="form-input-label" htmlFor="username">
              Username <span className="normal-case">(optional)</span>
            </label>
            <input
              className="form-input"
              id="username"
              name="username"
              type="text"
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

          {state.message && (
            <p className="error-message rounded-2xl border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3">
              {state.message}
            </p>
          )}

          <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isPending}
              onClick={() => router.replace('/profile')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-5 py-2.5 text-sm font-bold text-[var(--ink-muted)] shadow-sm transition-all duration-200 enabled:hover:bg-[var(--paper)] enabled:hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-5 py-2.5 text-sm font-bold text-[var(--paper-card)] shadow-sm transition-all duration-200 hover:bg-[var(--sage)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProfileEditForm;
