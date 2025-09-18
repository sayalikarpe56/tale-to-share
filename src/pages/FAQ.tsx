import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      category: "Getting Started",
      badge: "Popular",
      questions: [
        {
          question: "How do I create an account on BlogSpace?",
          answer: "Click the 'Sign In' button in the navigation and then select 'Sign Up'. You can create an account using your email address or sign up with social media providers."
        },
        {
          question: "What's the difference between blogs, stories, articles, and news?",
          answer: "Blogs are personal posts and opinions, Stories are narrative content, Articles are informative pieces, and News are current events and updates. Each has its own dedicated section on the platform."
        },
        {
          question: "Is BlogSpace free to use?",
          answer: "Yes, BlogSpace is completely free to use. You can create an account, publish content, and read other users' posts without any cost."
        }
      ]
    },
    {
      category: "Writing & Publishing",
      badge: "Essential",
      questions: [
        {
          question: "How do I write and publish my first post?",
          answer: "After signing in, click 'Write' in the navigation. Choose your content type (Blog, Story, Article, or News), write your content using our markdown editor, and click 'Publish' when ready."
        },
        {
          question: "Can I save drafts before publishing?",
          answer: "Yes, your content is automatically saved as you write. You can return to your drafts anytime from your profile dashboard."
        },
        {
          question: "What formatting options are available?",
          answer: "Our editor supports markdown formatting including headers, bold, italic, links, lists, code blocks, and images. You can also preview your content before publishing."
        },
        {
          question: "How do I add images to my posts?",
          answer: "You can upload images directly in the editor or use the image upload component. Images are automatically optimized for web display."
        }
      ]
    },
    {
      category: "Profile & Account",
      badge: "Account",
      questions: [
        {
          question: "How do I upload a profile photo?",
          answer: "Go to your profile page and click on the profile photo placeholder. You can upload an image which will be automatically cropped and optimized."
        },
        {
          question: "Can I edit my profile information?",
          answer: "Yes, you can edit your display name, bio, and other profile information from your profile page."
        },
        {
          question: "How do I view all my published content?",
          answer: "Your profile dashboard shows all your published blogs, stories, articles, and news in separate tabs. You can edit or delete any of your content from there."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account by contacting our support team. This action will permanently remove all your content and account data."
        }
      ]
    },
    {
      category: "Content Management",
      badge: "Management",
      questions: [
        {
          question: "Can I edit my posts after publishing?",
          answer: "Yes, you can edit your published content anytime. Go to your profile dashboard, find the post you want to edit, and click on it."
        },
        {
          question: "How do I delete a post?",
          answer: "From your profile dashboard, click on the post you want to delete and look for the delete option. This action cannot be undone."
        },
        {
          question: "Can I share my posts on social media?",
          answer: "Yes, each post has social sharing buttons that allow you to share on various platforms including Twitter, Facebook, and LinkedIn."
        }
      ]
    },
    {
      category: "Technical Support",
      badge: "Support",
      questions: [
        {
          question: "What should I do if I encounter an error?",
          answer: "Try refreshing the page first. If the issue persists, contact our support team with details about the error and what you were trying to do."
        },
        {
          question: "Is my data secure on BlogSpace?",
          answer: "Yes, we use industry-standard security measures to protect your data. All communications are encrypted, and we follow best practices for data protection."
        },
        {
          question: "What browsers are supported?",
          answer: "BlogSpace works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Find quick answers to common questions about using BlogSpace.
          </p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </header>

        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-semibold text-foreground">{category.category}</h2>
                <Badge variant="secondary">{category.badge}</Badge>
              </div>
              
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && searchTerm && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No FAQ items found matching "{searchTerm}". Try different keywords or{" "}
              <a href="/contact" className="text-primary hover:underline">contact support</a> for help.
            </p>
          </Card>
        )}

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Didn't find your answer?</h3>
          <p className="text-muted-foreground mb-6">
            Our support team is ready to help you with any questions.
          </p>
          <div className="space-x-4">
            <a href="/contact" className="text-primary hover:underline">Contact Support</a>
            <span className="text-muted-foreground">•</span>
            <a href="/help" className="text-primary hover:underline">Visit Help Center</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;