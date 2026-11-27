'use client';

import RouteError from '@/components/route-error';
import type { ErrorInfo } from 'next/error';

const ProfileError = ({ error, retry }: ErrorInfo) => {
  return (
    <RouteError error={error} retry={retry} title="Profile is unavailable" />
  );
};

export default ProfileError;
