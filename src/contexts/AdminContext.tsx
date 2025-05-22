import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AITool, ApiResponse } from '@/types/admin';

interface AdminContextType {
  tools: AITool[];
  loading: boolean;
  error: string | null;
  selectedTool: AITool | null;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  fetchData: () => Promise<void>;
  setSelectedTool: (tool: AITool | null) => void;
  createTool: (tool: AITool) => Promise<boolean>;
  updateTool: (id: string, tool: AITool) => Promise<boolean>;
  deleteTool: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [apiUrl, setApiUrl] = useState<string>(localStorage.getItem('admin_api_url') || '');
  const { toast } = useToast();

  useEffect(() => {
    if (apiUrl) {
      localStorage.setItem('admin_api_url', apiUrl);
    }
  }, [apiUrl]);

  const fetchData = async () => {
    if (!apiUrl) {
      setError('Please enter an API URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.success && data.data) {
        setTools(data.data);
        toast({
          title: "Data loaded successfully",
          description: `Loaded ${data.data.length} tools from API`,
        });
      } else {
        throw new Error(data.message || 'Unknown API error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      toast({
        title: "Error loading data",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTool = async (tool: AITool): Promise<boolean> => {
    if (!apiUrl) {
      setError('Please enter an API URL');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tool),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        await fetchData(); // Refresh data
        toast({
          title: "Success",
          description: "Tool created successfully",
        });
        return true;
      } else {
        throw new Error(data.message || 'Unknown API error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create tool';
      setError(errorMessage);
      toast({
        title: "Error creating tool",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTool = async (id: string, tool: AITool): Promise<boolean> => {
    if (!apiUrl) {
      setError('Please enter an API URL');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tool),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        await fetchData(); // Refresh data
        toast({
          title: "Success",
          description: "Tool updated successfully",
        });
        return true;
      } else {
        throw new Error(data.message || 'Unknown API error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tool';
      setError(errorMessage);
      toast({
        title: "Error updating tool",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTool = async (id: string): Promise<boolean> => {
    if (!apiUrl) {
      setError('Please enter an API URL');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setTools(tools.filter(tool => tool.id !== id));
        toast({
          title: "Success",
          description: "Tool deleted successfully",
        });
        return true;
      } else {
        throw new Error(data.message || 'Unknown API error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete tool';
      setError(errorMessage);
      toast({
        title: "Error deleting tool",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tools,
    loading,
    error,
    selectedTool,
    apiUrl, 
    setApiUrl,
    fetchData,
    setSelectedTool,
    createTool,
    updateTool,
    deleteTool,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
