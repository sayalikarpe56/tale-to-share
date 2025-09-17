import { supabase } from "@/integrations/supabase/client";
import { ContentFormData, ContentType } from "@/types/content";

class ContentService {
  async addContent(data: ContentFormData, type: ContentType) {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      throw new Error("User not authenticated");
    }

    const { data: result, error } = await supabase
      .from(type === 'story' ? 'stories' : type === 'article' ? 'articles' : 'news')
      .insert({
        user_id: user.data.user.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        tags: data.tags,
        read_time: data.read_time,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error adding ${type}:`, error);
      throw error;
    }

    return {
      id: result.id,
      title: result.title,
      content: result.content,
      excerpt: result.excerpt,
      author: result.author,
      publishedAt: new Date(result.published_at),
      readTime: result.read_time,
      tags: result.tags || []
    };
  }

  async getContent(type: ContentType) {
    const { data, error } = await supabase
      .from(type === 'story' ? 'stories' : type === 'article' ? 'articles' : 'news')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${type}:`, error);
      throw error;
    }

    return data?.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      author: item.author,
      publishedAt: new Date(item.published_at),
      readTime: item.read_time,
      tags: item.tags || []
    })) || [];
  }

  async getContentById(id: string, type: ContentType) {
    const { data, error } = await supabase
      .from(type === 'story' ? 'stories' : type === 'article' ? 'articles' : 'news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${type}:`, error);
      throw error;
    }

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
  }

  async deleteContent(id: string, type: ContentType) {
    const { error } = await supabase
      .from(type === 'story' ? 'stories' : type === 'article' ? 'articles' : 'news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting ${type}:`, error);
      throw error;
    }

    return true;
  }

  async getUserContent(userId: string, type: ContentType) {
    const { data, error } = await supabase
      .from(type === 'story' ? 'stories' : type === 'article' ? 'articles' : 'news')
      .select('*')
      .eq('user_id', userId)
      .order('published_at', { ascending: false });

    if (error) {
      console.error(`Error fetching user ${type}:`, error);
      throw error;
    }

    return data?.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      author: item.author,
      publishedAt: new Date(item.published_at),
      readTime: item.read_time,
      tags: item.tags || []
    })) || [];
  }
}

export const contentService = new ContentService();