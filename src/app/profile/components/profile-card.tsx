import { BookMarked, Mail, Pencil, UserRound } from 'lucide-react';
import Link from 'next/link';

import { Profile } from '@/app/lib/definitions';

type ProfileCardProps = {
  profile: Profile;
} & (
  | { isOwnProfile: true; email: string }
  | { isOwnProfile: false; email?: never }
);

const ProfileCard = ({ email, profile, isOwnProfile }: ProfileCardProps) => {
  return (
    <section className="profile-panel">
      <div className="profile-panel-header px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="profile-panel-icon">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--ink)] sm:text-2xl">
            {isOwnProfile ? 'Your profile' : 'Profile'}
          </h2>
        </div>
      </div>
      <div className="p-5 sm:p-8">
        <div>
          <h3 className="text-2xl font-semibold break-words text-[var(--ink)] sm:text-3xl">
            {profile.displayName}
          </h3>
          <p className="mt-1 break-all text-sm font-semibold text-[var(--sage-dark)] sm:text-base">
            @{profile.username}
          </p>
        </div>

        <Link
          href={`/diary/${profile.username}`}
          className="action-button action-button-primary mt-5 max-sm:gap-1.5 max-sm:px-3 max-sm:py-2 max-sm:text-xs sm:mt-6"
        >
          <BookMarked className="max-sm:h-3.5 max-sm:w-3.5" />
          View diary
        </Link>

        {isOwnProfile && (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--brass)] bg-[var(--paper)] px-4 py-3">
              <Mail className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
              <div className="min-w-0">
                <p className="text-[0.625rem] font-bold uppercase text-[var(--ink-muted)] sm:text-xs">
                  Email
                </p>
                <p className="mt-0.5 break-all text-sm font-semibold text-[var(--ink)]">
                  {email}
                </p>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="action-button action-button-primary shrink-0 self-end sm:self-auto"
            >
              <Pencil />
              Edit
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileCard;
