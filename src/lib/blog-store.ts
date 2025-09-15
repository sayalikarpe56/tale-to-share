import { BlogPost } from '@/types/blog';

// Simple in-memory store for demo purposes
class BlogStore {
  private blogs: BlogPost[] = [
    {
      id: '1',
      title: 'Welcome to Your Blog',
      content: `# Welcome to Your Blog

This is your first blog post! You can write beautiful content using Markdown syntax.

## Features

- **Rich Text Editing**: Write with ease using our intuitive editor
- **Beautiful Design**: Clean, modern interface focused on readability
- **Responsive**: Looks great on all devices

## Getting Started

Click the "Write" button in the navigation to create your first post. Share your thoughts, ideas, and stories with the world!

Happy blogging! ✨`,
      excerpt: 'Welcome to your new blogging platform. Start writing and sharing your thoughts with the world.',
      author: 'BlogCraft Team',
      publishedAt: new Date('2024-01-01'),
      readTime: 2,
      tags: ['welcome', 'getting-started']
    }
  ];

  getBlogs(): BlogPost[] {
    return [...this.blogs].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  getBlog(id: string): BlogPost | undefined {
    return this.blogs.find(blog => blog.id === id);
  }

  addBlog(blog: Omit<BlogPost, 'id' | 'publishedAt'>): BlogPost {
    const newBlog: BlogPost = {
      ...blog,
      id: Date.now().toString(),
      publishedAt: new Date(),
    };
    this.blogs.push(newBlog);
    return newBlog;
  }

  updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
    const index = this.blogs.findIndex(blog => blog.id === id);
    if (index === -1) return undefined;
    
    this.blogs[index] = { ...this.blogs[index], ...updates };
    return this.blogs[index];
  }

  deleteBlog(id: string): boolean {
    const index = this.blogs.findIndex(blog => blog.id === id);
    if (index === -1) return false;
    
    this.blogs.splice(index, 1);
    return true;
  }
}

export const blogStore = new BlogStore();