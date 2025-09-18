import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare, Lightbulb, Bug } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    rating: "",
    subject: "",
    message: "",
    email: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feedback submitted!",
      description: "Thank you for your feedback. We'll review it and get back to you if needed.",
    });
    setFormData({ type: "", category: "", rating: "", subject: "", message: "", email: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Send Feedback</h1>
          <p className="text-muted-foreground text-lg">
            Help us improve BlogSpace by sharing your thoughts, suggestions, or reporting issues.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">What type of feedback would you like to share?</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="suggestion" id="suggestion" />
                      <Label htmlFor="suggestion" className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Suggestion or Feature Request
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bug" id="bug" />
                      <Label htmlFor="bug" className="flex items-center gap-2">
                        <Bug className="w-4 h-4" />
                        Bug Report or Issue
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        General Feedback
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor & Writing</SelectItem>
                      <SelectItem value="ui">User Interface</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="mobile">Mobile Experience</SelectItem>
                      <SelectItem value="account">Account & Profile</SelectItem>
                      <SelectItem value="content">Content Management</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-semibold">Overall Rating</Label>
                  <RadioGroup
                    value={formData.rating}
                    onValueChange={(value) => handleChange("rating", value)}
                    className="mt-3 flex flex-wrap gap-4"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                        <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="ml-1">{rating}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="Brief description of your feedback"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Detailed Feedback</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Please provide detailed feedback..."
                    required
                    rows={6}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Your email for follow-up (optional)"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll only use this to follow up on your feedback if needed.
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Submit Feedback
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Feedback Guidelines</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Be specific about the issue or suggestion</p>
                <p>• Include steps to reproduce bugs</p>
                <p>• Mention your browser and device if reporting technical issues</p>
                <p>• Check our FAQ first for common questions</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Response Time</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Bug Reports:</strong> 24-48 hours</p>
                <p><strong>Feature Requests:</strong> 3-5 business days</p>
                <p><strong>General Feedback:</strong> 1 week</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="/help">Visit Help Center</a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;