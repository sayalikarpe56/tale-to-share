import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { PenTool, BookOpen, Zap, Users } from "lucide-react";
import heroImage from "@/assets/hero-blog.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Share Your{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Stories
                  </span>{" "}
                  with the World
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  A beautiful, modern blogging platform designed for writers who want to focus on what matters most - their content.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="lg">
                  <Link to="/write">
                    <PenTool className="w-5 h-5 mr-2" />
                    Start Writing
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/blogs">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read Blogs
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="Modern blogging workspace"
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Blog
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful tools that help you create and share amazing content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mx-auto">
                  <PenTool className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Rich Editor</h3>
                <p className="text-muted-foreground">
                  Write with a clean, distraction-free editor that supports Markdown and more.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Instant Publishing</h3>
                <p className="text-muted-foreground">
                  Publish your thoughts instantly and share them with your audience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Community</h3>
                <p className="text-muted-foreground">
                  Connect with other writers and readers in a vibrant community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Your Blogging Journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of writers who are already sharing their stories and building their audience.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/write">
                <PenTool className="w-5 h-5 mr-2" />
                Write Your First Post
              </Link>
            </Button>
            
            {/* Made in India Badge */}
            <div className="pt-8 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-green-500/10 border border-orange-500/20">
                <span className="text-2xl">🇮🇳</span>
                <span className="font-semibold text-sm">Made with ❤️ in India</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;