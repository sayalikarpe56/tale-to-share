import { supabase } from "@/integrations/supabase/client";

export interface Comment {
  id: string;
  user_id: string;
  content_id: string;
  content_type: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export class SocialService {
  async getComments(contentId: string, contentType: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(full_name, avatar_url)
      `)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return data?.map(comment => ({
      id: comment.id,
      user_id: comment.user_id,
      content_id: comment.content_id,
      content_type: comment.content_type,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      profile: Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
    })) || [];
  }

  async addComment(contentId: string, contentType: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to comment');
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        content_id: contentId,
        content_type: contentType,
        content: content
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    return data;
  }

  async deleteComment(commentId: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }

    return true;
  }

  async getLikesCount(contentId: string, contentType: string): Promise<number> {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    if (error) {
      console.error('Error fetching likes count:', error);
      return 0;
    }

    return count || 0;
  }

  async isLiked(contentId: string, contentType: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .maybeSingle();

    if (error) {
      console.error('Error checking like status:', error);
      return false;
    }

    return !!data;
  }

  async toggleLike(contentId: string, contentType: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to like');
    }

    const isCurrentlyLiked = await this.isLiked(contentId, contentType);

    if (isCurrentlyLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .eq('content_type', contentType);

      if (error) {
        console.error('Error removing like:', error);
        throw error;
      }

      return false;
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          content_id: contentId,
          content_type: contentType
        });

      if (error) {
        console.error('Error adding like:', error);
        throw error;
      }

      return true;
    }
  }
}

export const socialService = new SocialService();