import { supabase } from "@/integrations/supabase/client";

export interface FeedItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  readTime: number;
  tags: string[];
  type: 'blog' | 'story' | 'article' | 'news';
}

export class FeedService {
  async getFeed(): Promise<FeedItem[]> {
    try {
      const [blogs, stories, articles, news] = await Promise.all([
        this.getBlogs(),
        this.getStories(),
        this.getArticles(),
        this.getNews()
      ]);

      const allItems = [
        ...blogs.map(item => ({ ...item, type: 'blog' as const })),
        ...stories.map(item => ({ ...item, type: 'story' as const })),
        ...articles.map(item => ({ ...item, type: 'article' as const })),
        ...news.map(item => ({ ...item, type: 'news' as const }))
      ];

      // Sort by published date, newest first
      return allItems.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching feed:', error);
      return [];
    }
  }

  private async getBlogs() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;

    return data.map(blog => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      publishedAt: new Date(blog.published_at),
      readTime: blog.read_time,
      tags: blog.tags || []
    }));
  }

  private async getStories() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;

    return data.map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      excerpt: story.excerpt,
      author: story.author,
      publishedAt: new Date(story.published_at),
      readTime: story.read_time,
      tags: story.tags || []
    }));
  }

  private async getArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;

    return data.map(article => ({
      id: article.id,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      publishedAt: new Date(article.published_at),
      readTime: article.read_time,
      tags: article.tags || []
    }));
  }

  private async getNews() {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;

    return data.map(newsItem => ({
      id: newsItem.id,
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt,
      author: newsItem.author,
      publishedAt: new Date(newsItem.published_at),
      readTime: newsItem.read_time,
      tags: newsItem.tags || []
    }));
  }
}

export const feedService = new FeedService();