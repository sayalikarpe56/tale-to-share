import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contentService } from "@/lib/content-service";
import { Content, ContentType } from "@/types/content";
import { SocialShare } from "@/components/SocialShare";
import { SocialActions } from "@/components/SocialActions";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, User, BookOpen, Newspaper, Feather } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';

const contentTypeConfig = {
  story: {
    title: "Story",
    icon: Feather,
    color: "from-purple-500 to-pink-500",
    listRoute: '/stories'
  },
  article: {
    title: "Article", 
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    listRoute: '/articles'
  },
  news: {
    title: "News",
    icon: Newspaper,
    color: "from-green-500 to-emerald-500",
    listRoute: '/news'
  }
};

const ContentPost = () => {
  const { type, id } = useParams<{ type: ContentType; id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  const contentType = type || 'story';
  const config = contentTypeConfig[contentType];
  const IconComponent = config.icon;

  useEffect(() => {
    if (id && type) {
      fetchContent();
    }
  }, [id, type]);

  const fetchContent = async () => {
    if (!id || !type) return;
    
    try {
      setLoading(true);
      const data = await contentService.getContentById(id, type);
      setContent(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading {contentType}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{config.title} Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The {contentType} you're looking for doesn't exist.
              </p>
              <Button asChild>
                <Link to={config.listRoute}>Back to {config.title}s</Link>
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
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link to={config.listRoute}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {config.title}s
              </Link>
            </Button>
          </div>

          <article className="space-y-8">
            {/* Header */}
            <header className="space-y-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <IconComponent className="w-4 h-4" />
                <span className={`bg-gradient-to-r ${config.color} bg-clip-text text-transparent font-medium`}>
                  {config.title}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                {content.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{content.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(content.publishedAt, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{content.readTime} min read</span>
                </div>
              </div>

              {content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* Content */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      img: ({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt}
                          className="rounded-lg shadow-lg w-full h-auto my-6"
                          loading="lazy"
                        />
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 leading-relaxed text-foreground/90">
                          {children}
                        </p>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {content.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Social Share */}
            <div className="border-t pt-8">
        <SocialShare 
          title={content.title}
          url={window.location.href}
        />

        <div className="mt-8">
          <SocialActions
            contentId={content.id}
            contentType={type as string}
            title={content.title}
            url={window.location.href}
          />
        </div>
            </div>
          </article>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContentPost;