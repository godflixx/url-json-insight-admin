
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-4xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-admin-primary">
          AI Tools Admin Dashboard
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage your collection of AI tools with this powerful admin interface. 
          Add, edit, and organize tools with comprehensive metadata.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            size="lg" 
            className="bg-admin-primary hover:bg-admin-secondary text-white"
            onClick={() => navigate('/admin')}
          >
            Open Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/admin/tools')}
          >
            View Tools
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Comprehensive Management</h3>
            <p className="text-gray-600">
              Full CRUD operations for your AI tool database with a clean, intuitive interface.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Data Visualization</h3>
            <p className="text-gray-600">
              Interactive charts and statistics to analyze your catalog of tools.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Flexible API Integration</h3>
            <p className="text-gray-600">
              Connect to your own backend API endpoint with customizable settings.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="mt-16 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} AI Tools Admin Dashboard
      </footer>
    </div>
  );
};

export default Index;
