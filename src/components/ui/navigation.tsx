import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import { PenTool, Home, BookOpen } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <PenTool className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BlogCraft
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === "/" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/blogs" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === "/blogs" 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blogs</span>
          </Link>

          <Button asChild variant="hero">
            <Link to="/write">
              <PenTool className="w-4 h-4 mr-2" />
              Write
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};