import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { Textarea } from "@/components/ui/textarea";
import { blogService } from "@/lib/blog-service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import { PenTool, Send, X } from "lucide-react";

const WriteBlog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
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
        description: "Please sign in to publish a blog post.",
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
      // Check for copyright
      const copyrightCheck = await fetch(
        `https://orgxiugqbqacdhneyrxi.supabase.co/functions/v1/check-copyright`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: content.trim(), title: title.trim() })
        }
      );
      
      if (copyrightCheck.ok) {
        const copyrightResult = await copyrightCheck.json();
        if (copyrightResult.isCopyrighted && copyrightResult.confidence > 0.7) {
          toast({
            title: "Potential Copyright Issue",
            description: `${copyrightResult.reason}\n\nSuggestion: ${copyrightResult.suggestions}`,
            variant: "destructive",
          });
          setIsPublishing(false);
          return;
        }
      }
      
      // Add images to content if any are uploaded
      let finalContent = content.trim();
      if (images.length > 0) {
        const imageMarkdown = images.map(url => `![Blog Image](${url})`).join('\n\n');
        finalContent = `${finalContent}\n\n${imageMarkdown}`;
      }

      const blog = await blogService.addBlog({
        title: title.trim(),
        content: finalContent,
        excerpt: generateExcerpt(content),
        read_time: calculateReadTime(finalContent),
        tags: tags,
      });

      if (blog) {
        toast({
          title: "Blog Published!",
          description: "Your blog post has been published successfully.",
        });
        navigate(`/blog/${blog.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish blog post. Please try again.",
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
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Write
              </span>{" "}
              Your Story
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your thoughts, ideas, and experiences with the world.
            </p>
          </div>

          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PenTool className="w-5 h-5 text-primary" />
                <span>Create New Blog Post</span>
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
                  placeholder="Enter your blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here... You can use Markdown syntax for formatting."
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
                  onClick={() => navigate("/blogs")}
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

export default WriteBlog;