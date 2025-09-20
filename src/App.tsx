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
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import DMCA from "./pages/DMCA";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Feedback from "./pages/Feedback";
import Feed from "./pages/Feed";
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
                <Route path="/feed" element={<Feed />} />
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/stories" element={<ContentList type="stories" />} />
                <Route path="/articles" element={<ContentList type="articles" />} />
                <Route path="/news" element={<ContentList type="news" />} />
                <Route path="/write" element={<WriteBlog />} />
                <Route path="/write/:type" element={<WriteContent />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/story/:id" element={<ContentPost />} />
                <Route path="/article/:id" element={<ContentPost />} />
                <Route path="/news/:id" element={<ContentPost />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/dmca" element={<DMCA />} />
                <Route path="/help" element={<Help />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/feedback" element={<Feedback />} />
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
