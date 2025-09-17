export interface Content {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  readTime: number;
  tags: string[];
}

export interface ContentFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  read_time: number;
}

export type ContentType = 'story' | 'article' | 'news';

export interface Story extends Content {
  type: 'story';
}

export interface Article extends Content {
  type: 'article';
}

export interface News extends Content {
  type: 'news';
}