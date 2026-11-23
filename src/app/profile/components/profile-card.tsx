import { BookMarked, Mail, Pencil, UserRound } from 'lucide-react';
import Link from 'next/link';

import FollowButton from '@/app/profile/components/follow-button';
import type { ProfilePageData } from '@/types/profile';

interface ProfileCardProps {
  profile: ProfilePageData;
  viewer: { id: string; email?: string } | null;
}

const ProfileCard = ({ profile, viewer }: ProfileCardProps) => {
  const isOwnProfile = viewer?.id === profile.id;
  const isFollowing = profile.viewerFollowStatus === 'accepted';

  return (
    <section className="profile-panel">
      <div className="profile-panel-header px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <div className="profile-panel-icon">
            <UserRound className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--ink)] sm:text-xl">
            {isOwnProfile ? 'Your profile' : 'Profile'}
          </h2>
        </div>
      </div>
      <div className="p-5 sm:p-8">
        <div>
          <h3 className="text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
            {profile.displayName}
          </h3>
          <p className="mt-1 whitespace-nowrap text-sm font-semibold text-[var(--sage-dark)] sm:text-base">
            @{profile.username}
          </p>
          <p className="mt-2 flex gap-4 whitespace-nowrap text-sm text-[var(--ink-muted)] sm:text-base">
            <span>
              {profile.followerCount}{' '}
              {profile.followerCount === 1 ? 'follower' : 'followers'}
            </span>
            <span>{profile.followingCount} following</span>
          </p>
        </div>

        <div className="mt-5 grid grid-cols-[auto_1fr] items-start justify-items-start gap-x-3 sm:mt-6">
          <Link
            href={`/diary/${profile.username}`}
            className="action-button action-button-primary"
          >
            <BookMarked />
            View diary
          </Link>
          {viewer && !isOwnProfile && (
            <FollowButton
              key={profile.id}
              targetId={profile.id}
              isFollowing={isFollowing}
            />
          )}
        </div>

        {isOwnProfile && (
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--paper-muted)] bg-[var(--paper)] px-4 py-3">
              <Mail className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
              <div>
                <p className="text-[0.625rem] font-bold uppercase text-[var(--ink-muted)] sm:text-xs">
                  Email
                </p>
                <p className="mt-0.5 whitespace-nowrap text-sm font-semibold text-[var(--ink)]">
                  {viewer.email ?? 'Email unavailable'}
                </p>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="action-button action-button-secondary"
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
