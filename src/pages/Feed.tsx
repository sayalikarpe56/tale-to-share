import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { feedService, FeedItem } from "@/lib/feed-service";
import { Search, Calendar, Clock, BookOpen, Feather, Newspaper, PenTool } from "lucide-react";
import { format } from "date-fns";

const typeIcons = {
  blog: PenTool,
  story: Feather,
  article: BookOpen,
  news: Newspaper
};

const typeColors = {
  blog: "from-primary to-accent",
  story: "from-purple-500 to-pink-500",
  article: "from-blue-500 to-cyan-500",
  news: "from-green-500 to-emerald-500"
};

const Feed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, selectedType, items]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const data = await feedService.getFeed();
      setItems(data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading feed...</p>
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
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Latest Feed
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the latest blogs, stories, articles, and news from our community
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search everything..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex justify-center gap-2 flex-wrap">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
              >
                All
              </Button>
              <Button
                variant={selectedType === "blog" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("blog")}
                className="flex items-center gap-1"
              >
                <PenTool className="w-3 h-3" />
                Blogs
              </Button>
              <Button
                variant={selectedType === "story" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("story")}
                className="flex items-center gap-1"
              >
                <Feather className="w-3 h-3" />
                Stories
              </Button>
              <Button
                variant={selectedType === "article" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("article")}
                className="flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                Articles
              </Button>
              <Button
                variant={selectedType === "news" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("news")}
                className="flex items-center gap-1"
              >
                <Newspaper className="w-3 h-3" />
                News
              </Button>
            </div>
          </div>

          {/* Feed Grid */}
          {filteredItems.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm || selectedType !== "all" ? "No content found" : "No content yet"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedType !== "all"
                    ? "Try adjusting your search or filter terms."
                    : "Be the first to create some content."
                  }
                </p>
                {!searchTerm && selectedType === "all" && (
                  <Button asChild variant="hero">
                    <Link to="/write">
                      Start Writing
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const IconComponent = typeIcons[item.type];
                const colorClass = typeColors[item.type];
                
                return (
                  <Card key={`${item.type}-${item.id}`} className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
                          <IconComponent className="w-3 h-3 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {item.type}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        <Link to={`/${item.type === 'blog' ? 'blog' : item.type}/${item.id}`}>
                          {item.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {item.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(item.publishedAt, 'MMM d')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.readTime}m
                          </div>
                        </div>
                        <span className="font-medium">{item.author}</span>
                      </div>
                      
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;