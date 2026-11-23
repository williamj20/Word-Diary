'use client';

import { followProfile, unfollowProfile } from '@/lib/actions/follow';
import { UserRoundMinus, UserRoundPlus } from 'lucide-react';
import { useState, useTransition } from 'react';

const FollowButton = ({
  targetId,
  isFollowing,
}: {
  targetId: string;
  isFollowing: boolean;
}) => {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setError('');
    startTransition(async () => {
      try {
        const action = isFollowing ? unfollowProfile : followProfile;
        const { message } = await action(targetId);
        if (message) {
          setError(message);
        }
      } catch {
        setError('We could not save your change. Please try again.');
      }
    });
  };

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={handleClick}
        className="action-button action-button-secondary"
      >
        {isFollowing ? <UserRoundMinus /> : <UserRoundPlus />}
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      {error && <p className="error-message col-span-full mt-3">{error}</p>}
    </>
  );
};

export default FollowButton;
