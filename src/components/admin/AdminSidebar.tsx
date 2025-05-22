
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { Input } from '@/components/ui/input';
import { 
  Loader2, LayoutDashboard, Database, 
  PlusCircle, Settings, BookOpen
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const { apiUrl, setApiUrl, fetchData, loading } = useAdmin();
  const [inputApiUrl, setInputApiUrl] = useState(apiUrl);
  const location = useLocation();

  const handleFetchData = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputApiUrl !== apiUrl) {
      setApiUrl(inputApiUrl);
    }
    fetchData();
  };

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, path: "/admin" },
    { label: "Tools List", icon: <Database className="h-4 w-4" />, path: "/admin/tools" },
    { label: "Add New Tool", icon: <PlusCircle className="h-4 w-4" />, path: "/admin/tools/new" },
    { label: "Settings", icon: <Settings className="h-4 w-4" />, path: "/admin/settings" },
    { label: "View Library", icon: <BookOpen className="h-4 w-4" />, path: "/" }
  ];

  return (
    <aside className="w-64 bg-agent-card border-r border-agent-border flex flex-col h-full">
      <div className="p-4 border-b border-agent-border">
        <div className="flex items-center space-x-2">
          <div className="bg-agent-primary text-white p-2 rounded">
            <span className="font-bold">AI</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            <span className="text-agent-primary">Admin</span> Panel
          </h2>
        </div>
      </div>
      
      <div className="p-4 border-b border-agent-border">
        <form onSubmit={handleFetchData} className="space-y-3">
          <div>
            <label htmlFor="api-url" className="text-sm font-medium block mb-1 text-agent-muted">
              API URL
            </label>
            <Input
              id="api-url"
              type="text"
              value={inputApiUrl}
              onChange={(e) => setInputApiUrl(e.target.value)}
              placeholder="Enter API URL"
              className="w-full bg-agent-background border-agent-border"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-agent-primary hover:bg-agent-secondary text-white" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </>
            ) : (
              "Fetch Data"
            )}
          </Button>
        </form>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    location.pathname === item.path
                      ? "bg-agent-primary/20 text-agent-primary"
                      : "hover:bg-agent-background text-agent-muted hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-agent-border">
        <p className="text-xs text-agent-muted">AI Agents Library Admin v1.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
