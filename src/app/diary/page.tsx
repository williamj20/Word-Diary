import { requireSignedInProfile } from '@/lib/auth';
import { DiarySearchParams, getDiaryUrl } from '@/lib/diary-search-params';
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
