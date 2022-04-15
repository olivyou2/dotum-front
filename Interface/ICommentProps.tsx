export interface ICommentProps {
  postId: string;
  commentId: string;
  commentDesc: string;
  commentAuthor: string;
  onUpdate: () => void;
}
