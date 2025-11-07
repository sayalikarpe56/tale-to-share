import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Clock } from "lucide-react";
import { connectionService } from "@/lib/connection-service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface FollowButtonProps {
  userId: string;
  onStatusChange?: () => void;
}

export function FollowButton({ userId, onStatusChange }: FollowButtonProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<'none' | 'pending' | 'accepted' | 'following'>('none');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatus();
  }, [userId]);

  const loadStatus = async () => {
    const connectionStatus = await connectionService.getConnectionStatus(userId);
    setStatus(connectionStatus);
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error("Please sign in to follow users");
      return;
    }

    setLoading(true);
    try {
      await connectionService.sendFollowRequest(userId);
      setStatus('pending');
      toast.success("Follow request sent!");
      onStatusChange?.();
    } catch (error) {
      toast.error("Failed to send follow request");
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      await connectionService.unfollowUser(userId);
      setStatus('none');
      toast.success("Unfollowed successfully");
      onStatusChange?.();
    } catch (error) {
      toast.error("Failed to unfollow");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === userId) return null;

  if (status === 'following') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleUnfollow}
        disabled={loading}
      >
        <UserMinus className="h-4 w-4 mr-2" />
        Unfollow
      </Button>
    );
  }

  if (status === 'pending') {
    return (
      <Button variant="outline" size="sm" disabled>
        <Clock className="h-4 w-4 mr-2" />
        Pending
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleFollow}
      disabled={loading}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Follow
    </Button>
  );
}
