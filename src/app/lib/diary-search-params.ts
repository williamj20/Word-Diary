export interface DiarySearchParams {
  q?: string | string[];
  page?: string | string[];
}

const getFirstValue = (value?: string | string[]) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? '';

export const getDiarySearchParams = (params: DiarySearchParams = {}) => {
  const page = Number(getFirstValue(params.page));

  return {
    query: getFirstValue(params.q),
    currentPage: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
};

export const getDiaryUrl = (
  username: string,
  searchParams: DiarySearchParams = {}
) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      for (const item of Array.isArray(value) ? value : [value]) {
        params.append(key, item);
      }
    }
  }

  const query = params.toString();
  return `/diary/${username}${query ? `?${query}` : ''}`;
};
