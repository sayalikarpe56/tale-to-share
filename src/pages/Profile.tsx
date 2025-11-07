import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Edit3, Trash2, Eye, Calendar, BookOpen, Newspaper, Feather, PenTool, UserPlus, UserMinus, Check, X } from "lucide-react";
import { connectionService, Connection } from "@/lib/connection-service";
import { toast as sonnerToast } from "sonner";
import { blogService } from "@/lib/blog-service";
import { contentService } from "@/lib/content-service";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { Content } from "@/types/content";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userBlogs, setUserBlogs] = useState<BlogPost[]>([]);
  const [userStories, setUserStories] = useState<Content[]>([]);
  const [userArticles, setUserArticles] = useState<Content[]>([]);
  const [userNews, setUserNews] = useState<Content[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<Connection[]>([]);
  const [following, setFollowing] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserContent();
      fetchConnections();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          username: data.username || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContent = async () => {
    if (!user) return;

    try {
      // Fetch blogs
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', user.id)
        .order('published_at', { ascending: false });

      if (blogsError) throw blogsError;

      const blogs = blogsData.map(blog => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        author: blog.author,
        publishedAt: new Date(blog.published_at),
        readTime: blog.read_time,
        tags: blog.tags || []
      }));

      setUserBlogs(blogs);

      // Fetch all content types
      const [stories, articles, news] = await Promise.all([
        contentService.getUserContent(user.id, 'story'),
        contentService.getUserContent(user.id, 'article'),
        contentService.getUserContent(user.id, 'news')
      ]);

      setUserStories(stories);
      setUserArticles(articles);
      setUserNews(news);
    } catch (error) {
      console.error('Error fetching user content:', error);
      toast({
        title: "Error",
        description: "Failed to load your content.",
        variant: "destructive",
      });
    }
  };

  const fetchConnections = async () => {
    if (!user) return;

    const [followersData, followingData, pendingData] = await Promise.all([
      connectionService.getFollowers(user.id),
      connectionService.getFollowing(user.id),
      connectionService.getPendingRequests()
    ]);

    setFollowers(followersData);
    setFollowing(followingData);
    setPendingRequests(pendingData);
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      await connectionService.acceptFollowRequest(connectionId);
      sonnerToast.success("Follow request accepted!");
      fetchConnections();
    } catch (error) {
      sonnerToast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    try {
      await connectionService.rejectFollowRequest(connectionId);
      sonnerToast.success("Follow request rejected");
      fetchConnections();
    } catch (error) {
      sonnerToast.error("Failed to reject request");
    }
  };

  const handleAvatarUpdate = (url: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update(formData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            ...formData
          });

        if (error) throw error;
      }

      setIsEditing(false);
      await fetchProfile();
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to view your profile.
              </p>
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 md:grid-cols-4 sm:grid-cols-2">
              <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="blogs" className="text-xs lg:text-sm">Blogs ({userBlogs.length})</TabsTrigger>
              <TabsTrigger value="stories" className="text-xs lg:text-sm">Stories ({userStories.length})</TabsTrigger>
              <TabsTrigger value="articles" className="text-xs lg:text-sm">Articles ({userArticles.length})</TabsTrigger>
              <TabsTrigger value="news" className="text-xs lg:text-sm">News ({userNews.length})</TabsTrigger>
              <TabsTrigger value="followers" className="text-xs lg:text-sm">Followers ({followers.length})</TabsTrigger>
              <TabsTrigger value="following" className="text-xs lg:text-sm">Following ({following.length})</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs lg:text-sm">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold">
                        {profile?.full_name || "Anonymous User"}
                      </h1>
                      {profile?.username && (
                        <p className="text-muted-foreground">@{profile.username}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                    </div>
                  </div>
                  {profile?.bio && (
                    <p className="text-muted-foreground mt-4">{profile.bio}</p>
                  )}
                </CardHeader>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {userBlogs.length + userStories.length + userArticles.length + userNews.length}
                    </div>
                    <p className="text-muted-foreground">Total Published</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {[...userBlogs, ...userStories, ...userArticles, ...userNews].reduce((total, item) => total + item.readTime, 0)}
                    </div>
                    <p className="text-muted-foreground">Total Read Time (min)</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary-glow mb-2">
                      {new Set([...userBlogs, ...userStories, ...userArticles, ...userNews].flatMap(item => item.tags)).size}
                    </div>
                    <p className="text-muted-foreground">Unique Tags Used</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="blogs" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    My Blogs ({userBlogs.length})
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/write">
                      <PenTool className="w-4 h-4 mr-2" />
                      Write Blog
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {userBlogs.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No blogs published yet.</p>
                      <Button asChild variant="hero">
                        <Link to="/write">Write Your First Blog</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {userBlogs.map((blog) => (
                        <Link key={blog.id} to={`/blog/${blog.id}`}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base line-clamp-2">{blog.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{blog.excerpt}</p>
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                  <span>{format(blog.publishedAt, 'MMM d, yyyy')}</span>
                                  <span>{blog.readTime} min read</span>
                                </div>
                                {blog.tags.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {blog.tags[0]}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stories" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Feather className="w-5 h-5" />
                    My Stories ({userStories.length})
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/write/story">
                      <PenTool className="w-4 h-4 mr-2" />
                      Write Story
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {userStories.length === 0 ? (
                    <div className="text-center py-8">
                      <Feather className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No stories published yet.</p>
                      <Button asChild variant="hero">
                        <Link to="/write/story">Write Your First Story</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {userStories.map((story) => (
                        <Link key={story.id} to={`/story/${story.id}`}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base line-clamp-2">{story.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{story.excerpt}</p>
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                  <span>{format(story.publishedAt, 'MMM d, yyyy')}</span>
                                  <span>{story.readTime} min read</span>
                                </div>
                                {story.tags.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {story.tags[0]}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="articles" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    My Articles ({userArticles.length})
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/write/article">
                      <PenTool className="w-4 h-4 mr-2" />
                      Write Article
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {userArticles.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No articles published yet.</p>
                      <Button asChild variant="hero">
                        <Link to="/write/article">Write Your First Article</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {userArticles.map((article) => (
                        <Link key={article.id} to={`/article/${article.id}`}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                  <span>{format(article.publishedAt, 'MMM d, yyyy')}</span>
                                  <span>{article.readTime} min read</span>
                                </div>
                                {article.tags.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {article.tags[0]}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5" />
                    My News ({userNews.length})
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/write/news">
                      <PenTool className="w-4 h-4 mr-2" />
                      Write News
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {userNews.length === 0 ? (
                    <div className="text-center py-8">
                      <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No news published yet.</p>
                      <Button asChild variant="hero">
                        <Link to="/write/news">Write Your First News</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {userNews.map((news) => (
                        <Link key={news.id} to={`/news/${news.id}`}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base line-clamp-2">{news.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{news.excerpt}</p>
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                  <span>{format(news.publishedAt, 'MMM d, yyyy')}</span>
                                  <span>{news.readTime} min read</span>
                                </div>
                                {news.tags.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {news.tags[0]}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="followers" className="space-y-6">
              {pendingRequests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Follow Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={request.follower?.avatar_url} />
                              <AvatarFallback>
                                {request.follower?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{request.follower?.full_name}</p>
                              {request.follower?.username && (
                                <p className="text-sm text-muted-foreground">@{request.follower.username}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  {followers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No followers yet</p>
                  ) : (
                    <div className="space-y-4">
                      {followers.map((follower) => (
                        <div key={follower.id} className="flex items-center gap-3 p-4 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={follower.follower?.avatar_url} />
                            <AvatarFallback>
                              {follower.follower?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{follower.follower?.full_name}</p>
                            {follower.follower?.username && (
                              <p className="text-sm text-muted-foreground">@{follower.follower.username}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="following" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Following</CardTitle>
                </CardHeader>
                <CardContent>
                  {following.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Not following anyone yet</p>
                  ) : (
                    <div className="space-y-4">
                      {following.map((follow) => (
                        <div key={follow.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={follow.following?.avatar_url} />
                              <AvatarFallback>
                                {follow.following?.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{follow.following?.full_name}</p>
                              {follow.following?.username && (
                                <p className="text-sm text-muted-foreground">@{follow.following.username}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => connectionService.unfollowUser(follow.following_id).then(() => {
                              sonnerToast.success("Unfollowed successfully");
                              fetchConnections();
                            })}
                          >
                            <UserMinus className="h-4 w-4 mr-1" />
                            Unfollow
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Profile Information
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <ProfilePhotoUpload
                        currentAvatarUrl={profile?.avatar_url}
                        userName={profile?.full_name || user.email}
                        userId={user.id}
                        onAvatarUpdate={handleAvatarUpdate}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4 pt-4">
                        <Button onClick={updateProfile}>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              full_name: profile?.full_name || "",
                              username: profile?.username || "",
                              bio: profile?.bio || "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;