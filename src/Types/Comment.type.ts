export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
export interface CommentType {
  _id: string;
  content: string;
  image: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: string | null; // reply → id of its parent comment
  likes: string[];
  createdAt: string;
  replies?: CommentType[]; // ✅ NEW: nested replies (now typed → no more "as any")
}
