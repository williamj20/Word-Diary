export interface Profile {
  id: string;
  displayName: string;
  username: string;
  isPublic: boolean;
}

export interface ProfilePageData extends Profile {
  followerCount: number;
  followingCount: number;
  viewerFollowStatus: 'pending' | 'accepted' | null;
}
