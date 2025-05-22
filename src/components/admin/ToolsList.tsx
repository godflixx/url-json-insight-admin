
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AITool } from '@/types/admin';
import { useAdmin } from '@/contexts/AdminContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';

const ToolsList = () => {
  const { tools, loading, error, deleteTool, setSelectedTool } = useAdmin();
  const [search, setSearch] = useState('');
  const [filteredTools, setFilteredTools] = useState<AITool[]>([]);
  const [toolToDelete, setToolToDelete] = useState<AITool | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (tools) {
      setFilteredTools(
        tools.filter((tool) =>
          tool.title.toLowerCase().includes(search.toLowerCase()) ||
          tool.description.toLowerCase().includes(search.toLowerCase()) ||
          (tool.creator && tool.creator.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [tools, search]);

  const handleEdit = (tool: AITool) => {
    setSelectedTool(tool);
    navigate(`/admin/tools/edit/${tool.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (toolToDelete && toolToDelete.id) {
      await deleteTool(toolToDelete.id);
      setToolToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading tools...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">Error: {error}</p>
        <p className="text-sm text-red-600 mt-1">
          Please check your API URL and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Tools</h1>
          <p className="text-gray-500">{tools.length} tools found</p>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button
            onClick={() => {
              setSelectedTool(null);
              navigate('/admin/tools/new');
            }}
          >
            Add New Tool
          </Button>
        </div>
      </div>
      
      {filteredTools.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Title</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => (
                <TableRow key={tool.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      {tool.thumbnail && (
                        <img
                          src={tool.thumbnail}
                          alt={tool.title}
                          className="w-8 h-8 rounded object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      )}
                      <span>{tool.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tool.categories.slice(0, 3).map((category, i) => (
                        <Badge key={i} variant="outline">
                          {category}
                        </Badge>
                      ))}
                      {tool.categories.length > 3 && (
                        <Badge variant="outline">+{tool.categories.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tool.pricing_type === 'Free' ? 'default' : 'secondary'}>
                      {tool.pricing_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{tool.creator || 'Unknown'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(tool)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => setToolToDelete(tool)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No tools found. Try another search term or add new tools.</p>
        </div>
      )}
      
      <AlertDialog open={!!toolToDelete} onOpenChange={(open) => !open && setToolToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this tool?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{toolToDelete?.title}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ToolsList;
