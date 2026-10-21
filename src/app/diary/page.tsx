import { requireSignedInProfile } from '@/app/lib/auth';
import { DiarySearchParams, getDiaryUrl } from '@/app/lib/diary-search-params';
import { redirect } from 'next/navigation';

const DiaryPage = async ({
  searchParams,
}: {
  searchParams?: Promise<DiarySearchParams>;
}) => {
  const profile = await requireSignedInProfile();
  redirect(getDiaryUrl(profile.username, await searchParams));
};

export default DiaryPage;
