import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Newspaper, Feather, Calendar, UserPlus, Users } from "lucide-react";
import { blogService } from "@/lib/blog-service";
import { contentService } from "@/lib/content-service";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { Content } from "@/types/content";
import { toast } from "sonner";
import { format } from "date-fns";
import { FollowButton } from "@/components/FollowButton";
import { connectionService, Connection } from "@/lib/connection-service";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userBlogs, setUserBlogs] = useState<BlogPost[]>([]);
  const [userStories, setUserStories] = useState<Content[]>([]);
  const [userArticles, setUserArticles] = useState<Content[]>([]);
  const [userNews, setUserNews] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<Connection[]>([]);
  const [following, setFollowing] = useState<Connection[]>([]);

  useEffect(() => {
    if (userId) {
      // Redirect to own profile if viewing own ID
      if (user?.id === userId) {
        navigate('/profile');
        return;
      }
      fetchProfile();
      fetchUserContent();
      fetchConnections();
    }
  }, [userId, user]);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        toast.error("Profile not found");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContent = async () => {
    if (!userId) return;

    try {
      // Fetch blogs
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', userId)
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
        contentService.getUserContent(userId, 'story'),
        contentService.getUserContent(userId, 'article'),
        contentService.getUserContent(userId, 'news')
      ]);

      setUserStories(stories);
      setUserArticles(articles);
      setUserNews(news);
    } catch (error) {
      console.error('Error fetching user content:', error);
      toast.error("Failed to load content");
    }
  };

  const fetchConnections = async () => {
    if (!userId) return;

    const [followersData, followingData] = await Promise.all([
      connectionService.getFollowers(userId),
      connectionService.getFollowing(userId)
    ]);

    setFollowers(followersData);
    setFollowing(followingData);
  };

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
              <p className="text-muted-foreground mb-6">
                This profile doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </CardContent>
          </Card>
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
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-2">
              <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="blogs" className="text-xs lg:text-sm">Blogs ({userBlogs.length})</TabsTrigger>
              <TabsTrigger value="stories" className="text-xs lg:text-sm">Stories ({userStories.length})</TabsTrigger>
              <TabsTrigger value="articles" className="text-xs lg:text-sm">Articles ({userArticles.length})</TabsTrigger>
              <TabsTrigger value="news" className="text-xs lg:text-sm">News ({userNews.length})</TabsTrigger>
              <TabsTrigger value="followers" className="text-xs lg:text-sm">Followers ({followers.length})</TabsTrigger>
              <TabsTrigger value="following" className="text-xs lg:text-sm">Following ({following.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profile.avatar_url || ""} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                          {profile.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold">
                          {profile.full_name || "Anonymous User"}
                        </h1>
                        {profile.username && (
                          <p className="text-muted-foreground">@{profile.username}</p>
                        )}
                      </div>
                    </div>
                    <FollowButton userId={userId!} onStatusChange={fetchConnections} />
                  </div>
                  {profile.bio && (
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
                      {followers.length}
                    </div>
                    <p className="text-muted-foreground">Followers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary-glow mb-2">
                      {following.length}
                    </div>
                    <p className="text-muted-foreground">Following</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="blogs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Blogs ({userBlogs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBlogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No blogs published yet</p>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Feather className="w-5 h-5" />
                    Stories ({userStories.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userStories.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No stories published yet</p>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Articles ({userArticles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userArticles.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No articles published yet</p>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5" />
                    News ({userNews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userNews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No news published yet</p>
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
                        <Link 
                          key={follower.id} 
                          to={`/profile/${follower.follower_id}`}
                          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
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
                        </Link>
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
                        <Link 
                          key={follow.id} 
                          to={`/profile/${follow.following_id}`}
                          className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
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
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
