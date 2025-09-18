import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { Textarea } from "@/components/ui/textarea";
import { contentService } from "@/lib/content-service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import { PenTool, Send, X, BookOpen, Newspaper, Feather } from "lucide-react";
import { ContentType } from "@/types/content";

const contentTypeConfig = {
  story: {
    title: "Tell Your Story",
    subtitle: "Share personal experiences and narratives",
    icon: Feather,
    color: "from-purple-500 to-pink-500"
  },
  article: {
    title: "Write an Article", 
    subtitle: "Share knowledge and insights on topics you're passionate about",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500"
  },
  news: {
    title: "Report the News",
    subtitle: "Share important updates and current events",
    icon: Newspaper,
    color: "from-green-500 to-emerald-500"
  }
};

const WriteContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { type } = useParams<{ type: ContentType }>();
  
  const contentType = type || 'story';
  const config = contentTypeConfig[contentType];
  const IconComponent = config.icon;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  const [images, setImages] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const generateExcerpt = (content: string) => {
    const cleanText = content.replace(/[#*`]/g, "").trim();
    return cleanText.length > 160 
      ? cleanText.substring(0, 160) + "..." 
      : cleanText;
  };

  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to publish a ${contentType}.`,
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    
    try {
      // Add images to content if any are uploaded
      let finalContent = content.trim();
      if (images.length > 0) {
        const imageMarkdown = images.map(url => `![Content Image](${url})`).join('\n\n');
        finalContent = `${finalContent}\n\n${imageMarkdown}`;
      }

      const contentData = await contentService.addContent({
        title: title.trim(),
        content: finalContent,
        excerpt: generateExcerpt(content),
        read_time: calculateReadTime(finalContent),
        tags: tags,
      }, contentType);

      if (contentData) {
        toast({
          title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Published!`,
          description: `Your ${contentType} has been published successfully.`,
        });
        navigate(`/${contentType}/${contentData.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to publish ${contentType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold">
              <span className={`bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                {config.title}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {config.subtitle}
            </p>
          </div>

          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconComponent className="w-5 h-5 text-primary" />
                <span>Create New {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button onClick={addTag} variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder={`Enter your ${contentType} title...`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder={`Write your ${contentType} content here... You can use Markdown syntax for formatting.`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] resize-y"
                />
                <p className="text-sm text-muted-foreground">
                  Supports Markdown syntax. Estimated read time: {calculateReadTime(content)} minute{calculateReadTime(content) !== 1 ? 's' : ''}
                </p>
              </div>

              <ImageUpload 
                onImagesUploaded={setImages}
                maxImages={5}
              />

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/${contentType}s`)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="hero" 
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WriteContent;