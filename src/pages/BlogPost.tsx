import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { blogService } from "@/lib/blog-service";
import { SocialShare } from "@/components/SocialShare";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { BlogPost as BlogPostType } from "@/types/blog";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const fetchedBlog = await blogService.getBlog(id);
        setBlog(fetchedBlog);
      } catch (error) {
        console.error('Error loading blog:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Button asChild variant="hero">
              <Link to="/blogs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return format(date, "MMMM dd, yyyy");
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for demo with image support
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-1">{line.replace('- ', '')}</li>;
        }
        if (line.includes('**') && line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="mb-4">
              {parts.map((part, partIndex) => 
                partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
              )}
            </p>
          );
        }
        // Image markdown support
        if (line.match(/!\[.*\]\(.*\)/)) {
          const match = line.match(/!\[(.*)\]\((.*)\)/);
          if (match) {
            return (
              <div key={index} className="my-6">
                <img 
                  src={match[2]} 
                  alt={match[1]} 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                />
              </div>
            );
          }
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/blogs")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
            
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-border/50">
              <div className="text-foreground">
                {renderMarkdown(blog.content)}
              </div>
            </div>
          </article>

          {/* Social Share */}
          <div className="mt-8">
            <SocialShare 
              title={blog.title}
              url={window.location.href}
              excerpt={blog.excerpt}
            />
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Published by <span className="font-medium text-foreground">{blog.author}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(blog.publishedAt)}
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Button asChild variant="outline">
                  <Link to="/blogs">More Articles</Link>
                </Button>
                <Button asChild variant="hero">
                  <Link to="/write">Write Your Own</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;