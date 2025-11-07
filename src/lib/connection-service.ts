import { supabase } from "@/integrations/supabase/client";

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  follower?: {
    full_name: string;
    username?: string;
    avatar_url?: string;
  };
  following?: {
    full_name: string;
    username?: string;
    avatar_url?: string;
  };
}

export class ConnectionService {
  async sendFollowRequest(followingId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('connections')
      .insert({
        follower_id: user.id,
        following_id: followingId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending follow request:', error);
      throw error;
    }

    return data;
  }

  async acceptFollowRequest(connectionId: string) {
    const { error } = await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId);

    if (error) {
      console.error('Error accepting follow request:', error);
      throw error;
    }

    return true;
  }

  async rejectFollowRequest(connectionId: string) {
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);

    if (error) {
      console.error('Error rejecting follow request:', error);
      throw error;
    }

    return true;
  }

  async unfollowUser(userId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', userId);

    if (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }

    return true;
  }

  async getFollowers(userId: string): Promise<Connection[]> {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        follower:profiles!connections_follower_id_fkey(full_name, username, avatar_url)
      `)
      .eq('following_id', userId)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching followers:', error);
      return [];
    }

    return data?.map(conn => ({
      ...conn,
      follower: Array.isArray(conn.follower) ? conn.follower[0] : conn.follower
    })) || [];
  }

  async getFollowing(userId: string): Promise<Connection[]> {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        following:profiles!connections_following_id_fkey(full_name, username, avatar_url)
      `)
      .eq('follower_id', userId)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching following:', error);
      return [];
    }

    return data?.map(conn => ({
      ...conn,
      following: Array.isArray(conn.following) ? conn.following[0] : conn.following
    })) || [];
  }

  async getPendingRequests(): Promise<Connection[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        follower:profiles!connections_follower_id_fkey(full_name, username, avatar_url)
      `)
      .eq('following_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }

    return data?.map(conn => ({
      ...conn,
      follower: Array.isArray(conn.follower) ? conn.follower[0] : conn.follower
    })) || [];
  }

  async getConnectionStatus(userId: string): Promise<'none' | 'pending' | 'following'> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return 'none';

    const { data, error } = await supabase
      .from('connections')
      .select('status')
      .eq('follower_id', user.id)
      .eq('following_id', userId)
      .maybeSingle();

    if (error || !data) return 'none';

    return data.status === 'accepted' ? 'following' : 'pending';
  }
}

export const connectionService = new ConnectionService();
