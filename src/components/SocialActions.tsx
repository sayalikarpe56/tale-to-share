import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Send, Trash2 } from "lucide-react";
import { socialService, Comment } from "@/lib/social-service";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SocialActionsProps {
  contentId: string;
  contentType: string;
  title: string;
  url: string;
}

export const SocialActions = ({ contentId, contentType, title, url }: SocialActionsProps) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [contentId, contentType]);

  const loadData = async () => {
    try {
      const [likesCount, likedStatus, commentsData] = await Promise.all([
        socialService.getLikesCount(contentId, contentType),
        socialService.isLiked(contentId, contentType),
        socialService.getComments(contentId, contentType)
      ]);

      setLikes(likesCount);
      setIsLiked(likedStatus);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading social data:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like this content.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newLikedStatus = await socialService.toggleLike(contentId, contentType);
      setIsLiked(newLikedStatus);
      setLikes(prev => newLikedStatus ? prev + 1 : prev - 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment.",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await socialService.addComment(contentId, contentType, newComment.trim());
      setNewComment("");
      await loadData();
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await socialService.deleteComment(commentId);
      await loadData();
      toast({
        title: "Success",
        description: "Comment deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          variant={isLiked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          className="flex items-center gap-2"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          {likes} {likes === 1 ? 'Like' : 'Likes'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Add Comment */}
          {user && (
            <div className="space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || loading}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.profile?.avatar_url} />
                        <AvatarFallback>
                          {comment.profile?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {comment.profile?.full_name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          {user?.id === comment.user_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};