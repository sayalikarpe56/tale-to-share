import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { contentService } from "@/lib/content-service";
import { Content, ContentType } from "@/types/content";
import { Search, Calendar, Clock, PenTool, BookOpen, Newspaper, Feather } from "lucide-react";
import { format } from "date-fns";

const contentTypeConfig = {
  stories: {
    title: "Stories",
    subtitle: "Personal narratives and experiences",
    icon: Feather,
    color: "from-purple-500 to-pink-500",
    type: 'story' as ContentType
  },
  articles: {
    title: "Articles", 
    subtitle: "In-depth knowledge and insights",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    type: 'article' as ContentType
  },
  news: {
    title: "News",
    subtitle: "Latest updates and current events",
    icon: Newspaper,
    color: "from-green-500 to-emerald-500",
    type: 'news' as ContentType
  }
};

const ContentList = () => {
  const { type } = useParams<{ type: 'stories' | 'articles' | 'news' }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const contentType = type || 'stories';
  const config = contentTypeConfig[contentType];
  const IconComponent = config.icon;

  useEffect(() => {
    fetchContents();
  }, [contentType]);

  useEffect(() => {
    filterContents();
  }, [searchTerm, contents]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await contentService.getContent(config.type);
      setContents(data);
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    if (!searchTerm.trim()) {
      setFilteredContents(contents);
      return;
    }

    const filtered = contents.filter((content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredContents(filtered);
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className={`bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                {config.title}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.subtitle}
            </p>
            <div className="flex justify-center">
              <Button asChild variant="hero">
                <Link to={`/write/${config.type}`}>
                  <PenTool className="w-4 h-4 mr-2" />
                  Write New {config.title.slice(0, -1)}
                </Link>
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={`Search ${contentType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Content Grid */}
          {filteredContents.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? `No ${contentType} found` : `No ${contentType} yet`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm 
                    ? `Try adjusting your search terms.`
                    : `Be the first to write a ${config.title.slice(0, -1).toLowerCase()}.`
                  }
                </p>
                {!searchTerm && (
                  <Button asChild variant="hero">
                    <Link to={`/write/${config.type}`}>
                      Write First {config.title.slice(0, -1)}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContents.map((content) => (
                <Card key={content.id} className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      <Link to={`/${config.type}/${content.id}`}>
                        {content.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {content.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(content.publishedAt, 'MMM d')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {content.readTime}m
                        </div>
                      </div>
                      <span className="font-medium">{content.author}</span>
                    </div>
                    
                    {content.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {content.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {content.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{content.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentList;