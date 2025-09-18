import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen, Edit, Users, Settings } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions and learn how to use BlogSpace effectively.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Getting Started</h3>
            <p className="text-muted-foreground text-sm">Learn the basics of creating and publishing content</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Edit className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Writing Tips</h3>
            <p className="text-muted-foreground text-sm">Best practices for engaging content creation</p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Community</h3>
            <p className="text-muted-foreground text-sm">Connect with other writers and readers</p>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create my first blog post?</AccordionTrigger>
              <AccordionContent>
                To create your first blog post, sign in to your account and click "Write Blog" in the navigation. 
                You'll be taken to our editor where you can write your content using markdown formatting.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>What types of content can I publish?</AccordionTrigger>
              <AccordionContent>
                BlogSpace supports multiple content types: blog posts, stories, articles, and news. 
                Each type has its own dedicated section and can be managed from your profile dashboard.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I upload a profile photo?</AccordionTrigger>
              <AccordionContent>
                Go to your profile page and click on the profile photo area. You can upload an image 
                which will be automatically resized and optimized for display.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I edit my published content?</AccordionTrigger>
              <AccordionContent>
                Yes, you can edit your published content at any time from your profile dashboard. 
                Click on any of your posts to view and edit them.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I delete my account?</AccordionTrigger>
              <AccordionContent>
                To delete your account, please contact our support team at support@blogspace.com. 
                We'll help you through the process and ensure all your data is properly handled.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Still need help?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="space-x-4">
            <a href="/contact" className="text-primary hover:underline">Contact Support</a>
            <span className="text-muted-foreground">•</span>
            <a href="/feedback" className="text-primary hover:underline">Send Feedback</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;