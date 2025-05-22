
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { Input } from '@/components/ui/input';
import { Loader2, LayoutDashboard, Database, PlusCircle, Settings } from 'lucide-react';

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
    { label: "Settings", icon: <Settings className="h-4 w-4" />, path: "/admin/settings" }
  ];

  return (
    <aside className="w-64 bg-white border-r border-admin-border flex flex-col h-full">
      <div className="p-4 border-b border-admin-border">
        <h2 className="text-xl font-bold text-admin-primary">Admin Panel</h2>
      </div>
      
      <div className="p-4 border-b border-admin-border">
        <form onSubmit={handleFetchData} className="space-y-3">
          <div>
            <label htmlFor="api-url" className="text-sm font-medium block mb-1">
              API URL
            </label>
            <Input
              id="api-url"
              type="text"
              value={inputApiUrl}
              onChange={(e) => setInputApiUrl(e.target.value)}
              placeholder="Enter API URL"
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full bg-admin-primary hover:bg-admin-secondary" disabled={loading}>
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
                      ? "bg-admin-accent/10 text-admin-primary"
                      : "hover:bg-admin-accent/5"
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
      
      <div className="p-4 border-t border-admin-border">
        <p className="text-xs text-gray-500">AI Tools Admin Panel v1.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
