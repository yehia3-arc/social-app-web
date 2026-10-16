export interface UserTypeProfile {
  _id: string;
  id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  photo: string;
  cover: string;
  bookmarks: string[];
  followers: any[]; // ✅ API may return ids OR full user objects → any[] + code normalizes
  following: string[];
  createdAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  postsCount?: number; // ✅ NEW: UserProfile reads user?.postsCount
}
