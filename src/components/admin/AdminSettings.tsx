
import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertOctagon, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminSettings = () => {
  const { apiUrl, setApiUrl } = useAdmin();
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl);
  const { toast } = useToast();

  // Reset temp value when apiUrl changes
  useEffect(() => {
    setTempApiUrl(apiUrl);
  }, [apiUrl]);

  const handleSaveSettings = () => {
    setApiUrl(tempApiUrl);
    toast({
      title: "Settings saved",
      description: "Your API URL has been updated.",
    });
  };

  const handleResetSettings = () => {
    localStorage.removeItem('admin_api_url');
    setApiUrl('');
    setTempApiUrl('');
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure the API endpoint for the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              value={tempApiUrl}
              onChange={(e) => setTempApiUrl(e.target.value)}
              placeholder="https://api.example.com/tools"
            />
            <p className="text-sm text-muted-foreground">
              Enter the base URL for the API that handles CRUD operations
            </p>
          </div>
          
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertOctagon className="h-4 w-4" />
            <AlertTitle>API Requirements</AlertTitle>
            <AlertDescription>
              <p className="mt-2">
                The API must support the following endpoints:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><code className="bg-red-100 px-1 rounded">[GET] /</code> - Fetch all tools</li>
                <li><code className="bg-red-100 px-1 rounded">[POST] /create</code> - Create a new tool</li>
                <li><code className="bg-red-100 px-1 rounded">[PUT] /update/:id</code> - Update an existing tool</li>
                <li><code className="bg-red-100 px-1 rounded">[DELETE] /delete/:id</code> - Delete a tool</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Response Format</AlertTitle>
            <AlertDescription>
              <p className="mt-2">
                The API should return responses in the following format:
              </p>
              <pre className="bg-gray-100 p-3 rounded-md mt-2 text-xs overflow-auto">
{`{
  "success": true,
  "data": [...],
  "message": "Optional message"
}`}
              </pre>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSettings;
