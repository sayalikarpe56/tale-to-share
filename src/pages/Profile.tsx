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
import { User, Edit3, Trash2, Eye, Calendar, BookOpen, Newspaper, Feather } from "lucide-react";
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
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserContent();
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="blogs">Blogs ({userBlogs.length})</TabsTrigger>
              <TabsTrigger value="stories">Stories ({userStories.length})</TabsTrigger>
              <TabsTrigger value="articles">Articles ({userArticles.length})</TabsTrigger>
              <TabsTrigger value="news">News ({userNews.length})</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
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