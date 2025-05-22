
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Bot, Sparkles, RefreshCw, 
  ChevronRight, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Index: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-agent-background text-white">
      {/* Floating background dots for decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-dots w-10 h-10 top-[20%] left-[10%]"></div>
        <div className="floating-dots w-8 h-8 top-[30%] left-[25%]"></div>
        <div className="floating-dots w-12 h-12 top-[15%] right-[18%]"></div>
        <div className="floating-dots w-6 h-6 top-[40%] right-[15%]"></div>
        <div className="floating-dots w-14 h-14 bottom-[30%] left-[15%]"></div>
        <div className="floating-dots w-9 h-9 bottom-[20%] right-[25%]"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-agent-primary text-white p-2 rounded">
              <span className="font-bold">AI</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Agent Library</h1>
              <p className="text-xs text-agent-muted">Discover AI Solutions</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="space-x-6">
              <Link to="/" className="text-white border-b-2 border-agent-primary pb-1">Home</Link>
              <Link to="/browse" className="text-agent-muted hover:text-white transition-colors">Browse</Link>
              <Link to="/about" className="text-agent-muted hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-agent-muted hover:text-white transition-colors">Contact</Link>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agent-muted h-4 w-4" />
              <Input 
                placeholder="Search agents..."
                className="pl-10 bg-agent-card border-agent-border w-64 rounded-full focus:ring-agent-primary"
              />
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-agent-card py-4 px-6 z-50 border-b border-agent-border">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-white font-medium">Home</Link>
              <Link to="/browse" className="text-agent-muted">Browse</Link>
              <Link to="/about" className="text-agent-muted">About</Link>
              <Link to="/contact" className="text-agent-muted">Contact</Link>
              
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agent-muted h-4 w-4" />
                <Input 
                  placeholder="Search agents..."
                  className="pl-10 bg-agent-background border-agent-border rounded-full focus:ring-agent-primary"
                />
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 text-center max-w-5xl mx-auto px-6 z-10">
        <h1 className="agent-header text-5xl md:text-7xl font-bold mb-6">
          AI Agents Library
        </h1>
        <p className="text-xl text-agent-muted mb-12 max-w-3xl mx-auto">
          Discover and explore the best AI agents for your specific needs
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/browse">
            <Button className="bg-agent-primary hover:bg-agent-secondary text-white px-10 py-6 rounded-md text-lg">
              Browse Agents
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" className="border-agent-border text-white hover:bg-agent-card px-10 py-6 rounded-md text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="agent-card p-8 flex flex-col items-center text-center">
              <div className="p-4 bg-agent-primary/20 rounded-full mb-6">
                <Bot className="h-8 w-8 text-agent-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered</h3>
              <p className="text-agent-muted">
                Discover cutting-edge artificial intelligence agents designed to handle your most complex tasks with remarkable efficiency.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="agent-card p-8 flex flex-col items-center text-center">
              <div className="p-4 bg-agent-primary/20 rounded-full mb-6">
                <Sparkles className="h-8 w-8 text-agent-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Easy Discovery</h3>
              <p className="text-agent-muted">
                Our intuitive platform makes it simple to find the perfect agent tailored to your specific requirements and use cases.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="agent-card p-8 flex flex-col items-center text-center">
              <div className="p-4 bg-agent-primary/20 rounded-full mb-6">
                <RefreshCw className="h-8 w-8 text-agent-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Always Updated</h3>
              <p className="text-agent-muted">
                Stay at the forefront of AI innovation with our continuously updated library featuring the latest and most advanced agents.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Admin Link */}
      <div className="fixed bottom-6 right-6 z-20">
        <Link to="/admin">
          <Button className="bg-agent-primary hover:bg-agent-secondary text-white rounded-full">
            Admin Panel <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
