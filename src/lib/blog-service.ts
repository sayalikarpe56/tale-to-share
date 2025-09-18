import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';

export interface BlogCreate {
  title: string;
  content: string;
  excerpt: string;
  read_time: number;
  tags: string[];
}

export class BlogService {
  async getBlogs(): Promise<BlogPost[]> {
    try {
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
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  async getBlog(id: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        publishedAt: new Date(data.published_at),
        readTime: data.read_time,
        tags: data.tags || []
      };
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }

  async addBlog(blog: BlogCreate): Promise<BlogPost | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to create a blog');
      }

      // Get user's full name from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      const authorName = profile?.full_name || 'Anonymous';

      const { data, error } = await supabase
        .from('blogs')
        .insert({
          user_id: user.id,
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          author: authorName,
          read_time: blog.read_time,
          tags: blog.tags
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        publishedAt: new Date(data.published_at),
        readTime: data.read_time,
        tags: data.tags || []
      };
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  async updateBlog(id: string, updates: Partial<BlogCreate>): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        publishedAt: new Date(data.published_at),
        readTime: data.read_time,
        tags: data.tags || []
      };
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  async deleteBlog(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      return false;
    }
  }
}

export const blogService = new BlogService();