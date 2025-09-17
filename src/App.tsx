import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import WriteBlog from "./pages/WriteBlog";
import WriteContent from "./pages/WriteContent";
import BlogPost from "./pages/BlogPost";
import ContentList from "./pages/ContentList";
import ContentPost from "./pages/ContentPost";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/stories" element={<ContentList />} />
                <Route path="/articles" element={<ContentList />} />
                <Route path="/news" element={<ContentList />} />
                <Route path="/write" element={<WriteBlog />} />
                <Route path="/write/:type" element={<WriteContent />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/story/:id" element={<ContentPost />} />
                <Route path="/article/:id" element={<ContentPost />} />
                <Route path="/news/:id" element={<ContentPost />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
