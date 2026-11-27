'use client';

import RouteError from '@/components/route-error';
import type { ErrorInfo } from 'next/error';

const ProfileSetupError = ({ error, retry }: ErrorInfo) => (
  <RouteError
    error={error}
    retry={retry}
    title="Profile setup is unavailable"
  />
);

export default ProfileSetupError;
