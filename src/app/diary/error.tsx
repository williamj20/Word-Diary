'use client';

import RouteError from '@/components/route-error';
import type { ErrorInfo } from 'next/error';

const DiaryError = ({ error, retry }: ErrorInfo) => {
  return (
    <RouteError error={error} retry={retry} title="Diary is unavailable" />
  );
};

export default DiaryError;
