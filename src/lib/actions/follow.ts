'use server';

import { getCurrentProfile } from '@/lib/data';
import sql from '@/lib/dbClient';
import type { Profile } from '@/types/profile';
import { revalidatePath } from 'next/cache';
import type { TransactionSql } from 'postgres';

interface FollowResult {
  message?: string;
}

const getFollowTarget = async (
  transaction: TransactionSql,
  targetId: string
) => {
  // Keep the target's visibility and username stable through the mutation.
  const [target] = await transaction<Pick<Profile, 'username' | 'isPublic'>[]>`
    select username, profile_is_public as "isPublic"
    from public.profiles
    where id = ${targetId}::uuid
    for no key update
  `;
  return target ?? null;
};

const revalidateProfilePages = (
  viewerUsername: string,
  targetUsername: string
) => {
  revalidatePath(`/profile/${targetUsername}`);
  revalidatePath(`/profile/${viewerUsername}`);
};

export const followProfile = async (
  targetId: string
): Promise<FollowResult> => {
  try {
    const viewer = await getCurrentProfile();
    if (!viewer) {
      return {
        message: 'Please sign in with a completed profile to continue.',
      };
    }
    if (viewer.id === targetId) {
      return { message: 'You cannot follow yourself.' };
    }

    const result = await sql.begin(async transaction => {
      const target = await getFollowTarget(transaction, targetId);
      if (!target) {
        return { message: 'This profile is unavailable.' };
      }

      if (!target.isPublic) {
        return { message: 'This profile is private.' };
      }

      // request_profile_follow reads auth.uid() from these transaction-local claims.
      await transaction`
        select set_config('request.jwt.claims', ${JSON.stringify({ sub: viewer.id })}, true)
      `;
      const [relationship] = await transaction<{ status: string }[]>`
        select status from public.request_profile_follow(${targetId}::uuid)
      `;
      if (relationship.status !== 'accepted') {
        return { message: 'This follow request is pending.' };
      }
      return { username: target.username };
    });

    if ('message' in result) {
      return { message: result.message };
    }

    revalidateProfilePages(viewer.username, result.username);
    return {};
  } catch (error) {
    console.error('Failed to follow profile', error);
    return { message: 'Could not follow this profile. Please try again.' };
  }
};

export const unfollowProfile = async (
  targetId: string
): Promise<FollowResult> => {
  try {
    const viewer = await getCurrentProfile();
    if (!viewer) {
      return {
        message: 'Please sign in with a completed profile to continue.',
      };
    }
    if (viewer.id === targetId) {
      return { message: 'You cannot follow yourself.' };
    }

    const targetUsername = await sql.begin(async transaction => {
      const target = await getFollowTarget(transaction, targetId);
      if (!target) {
        return null;
      }
      await transaction`
        delete from public.profile_follows
        where follower_id = ${viewer.id}::uuid and followed_id = ${targetId}::uuid
          and status = 'accepted'
      `;
      return target.username;
    });

    if (targetUsername === null) {
      return { message: 'This profile is unavailable.' };
    }
    revalidateProfilePages(viewer.username, targetUsername);
    return {};
  } catch (error) {
    console.error('Failed to unfollow profile', error);
    return { message: 'Could not unfollow this profile. Please try again.' };
  }
};
