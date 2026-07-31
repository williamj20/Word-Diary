'use client';

import RouteError from '@/app/components/route-error';
import type { ErrorInfo } from 'next/error';

const DiaryError = ({ error, unstable_retry }: ErrorInfo) => {
  return (
    <RouteError
      error={error}
      retry={unstable_retry}
      title="Your diary is unavailable"
    />
  );
};

export default DiaryError;
