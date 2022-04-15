export interface IPostProps {
  projectId: string;
  postId: string;
  description: string;
  date?: number;
  photos: string[];
  like: string[];
  update: () => void;
}
