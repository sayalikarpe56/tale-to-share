export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  readTime: number;
  tags: string[];
}

export interface BlogFormData {
  title: string;
  content: string;
  tags: string[];
}