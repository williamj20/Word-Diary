import HeaderNavLink from '@/components/header-nav-link';
import AccountMenu from '@/components/account-menu';
import MobileHeaderMenu from '@/components/mobile-header-menu';
import { getCurrentProfile } from '@/lib/data';
import { BookMarked, BookOpenText, Sparkles } from 'lucide-react';
import Link from 'next/link';

const AppHeader = async ({
  showAuthenticatedControls,
}: {
  showAuthenticatedControls: boolean;
}) => {
  const profile = showAuthenticatedControls ? await getCurrentProfile() : null;
  const profileHref = profile && `/profile/${profile.username}`;
  const diaryHref = profile && `/diary/${profile.username}`;

  return (
    <header className="mx-auto mb-8 mt-1 max-w-7xl sm:mb-10">
      <div
        className={
          profileHref
            ? 'grid grid-cols-[minmax(max-content,1fr)_auto] items-center gap-3 md:grid-cols-[minmax(max-content,1fr)_max-content_minmax(max-content,1fr)] md:gap-4'
            : 'flex justify-center'
        }
      >
        <Link
          href="/"
          className="flex min-w-max items-center justify-start gap-2 md:justify-self-start md:gap-3.5"
        >
          <BookOpenText className="h-5 w-5 shrink-0 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
          <h1
            className={
              profileHref
                ? 'text-4xl font-semibold whitespace-nowrap text-[var(--ink)] md:text-[2rem] lg:text-[2.75rem]'
                : 'text-4xl font-semibold whitespace-nowrap text-[var(--ink)] sm:text-[2.75rem]'
            }
          >
            Word Diary
          </h1>
        </Link>

        {profileHref && diaryHref && (
          <MobileHeaderMenu profileHref={profileHref} diaryHref={diaryHref} />
        )}

        {diaryHref && (
          <nav className="hidden min-w-max justify-center gap-2 md:flex md:justify-self-center">
            <HeaderNavLink href="/diary" section={diaryHref}>
              <BookMarked className="h-3.5 w-3.5" />
              Diary
            </HeaderNavLink>
            <HeaderNavLink href="/flashcards" section="/flashcards">
              <Sparkles className="h-3.5 w-3.5" />
              Flashcards
            </HeaderNavLink>
          </nav>
        )}

        {profileHref && (
          <div className="hidden justify-center md:flex md:justify-self-end">
            <AccountMenu profileHref={profileHref} />
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
