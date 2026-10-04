import { Mail, Pencil, UserRound } from 'lucide-react';
import Link from 'next/link';

import { CurrentProfile } from '@/app/lib/definitions';

const ProfileCard = ({
  email,
  profile,
}: {
  email: string;
  profile: CurrentProfile;
}) => {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)]">
      <div className="border-b border-[var(--brass)] bg-[var(--sage-soft)] px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--sage)] bg-[var(--paper-card)] text-[var(--sage-dark)] shadow-sm">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">
            Your profile
          </h2>
        </div>
      </div>
      <div className="p-5 sm:p-8">
        <div>
          <h3
            className={`text-2xl font-semibold break-words sm:text-3xl ${
              profile.displayName
                ? 'text-[var(--ink)]'
                : 'text-[var(--ink-muted)]'
            }`}
          >
            {profile.displayName ?? 'Display name not set'}
          </h3>
          <p className="mt-1 break-all text-sm font-semibold text-[var(--sage-dark)] sm:text-base">
            {profile.username ? `@${profile.username}` : 'Username not set'}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--brass)] bg-[var(--paper)] px-4 py-3">
            <Mail className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
            <div className="min-w-0">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                Email
              </p>
              <p className="mt-0.5 break-all text-sm font-semibold text-[var(--ink)]">
                {email}
              </p>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-5 py-2.5 text-sm font-bold text-[var(--paper-card)] shadow-sm transition-all duration-200 hover:bg-[var(--sage)]"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
