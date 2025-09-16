import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { blogService } from "@/lib/blog-service";
import { Clock, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { BlogPost } from "@/types/blog";

const BlogList = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const fetchedBlogs = await blogService.getBlogs();
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Latest{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing stories, insights, and ideas from our community of writers.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No blogs yet</h3>
              <p className="text-muted-foreground mb-8">Be the first to share your story!</p>
              <Link 
                to="/write" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Write Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} to={`/blog/${blog.id}`}>
                  <Card className="h-full border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                    <CardHeader className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h2>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground line-clamp-3">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{blog.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readTime} min read</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;