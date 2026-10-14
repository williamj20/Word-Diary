'use client';

import RouteError from '@/app/components/route-error';
import type { ErrorInfo } from 'next/error';

const ProfileSetupError = ({ error, unstable_retry }: ErrorInfo) => (
  <RouteError
    error={error}
    retry={unstable_retry}
    title="Profile setup is unavailable"
  />
);

export default ProfileSetupError;
