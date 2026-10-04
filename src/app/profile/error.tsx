'use client';

import RouteError from '@/app/components/route-error';
import type { ErrorInfo } from 'next/error';

const ProfileError = ({ error, unstable_retry }: ErrorInfo) => {
  return (
    <RouteError
      error={error}
      retry={unstable_retry}
      title="Your profile is unavailable"
    />
  );
};

export default ProfileError;
