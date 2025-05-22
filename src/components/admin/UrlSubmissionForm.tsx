
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AITool } from '@/types/admin';
import { Loader2, Info } from 'lucide-react';

interface UrlSubmissionFormProps {
  onDataReceived: (data: AITool) => void;
  apiUrl: string;
}

const UrlSubmissionForm: React.FC<UrlSubmissionFormProps> = ({ 
  onDataReceived,
  apiUrl 
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive"
      });
      return;
    }

    if (!apiUrl) {
      toast({
        title: "Error",
        description: "API URL is not configured. Please set it in settings.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/extract-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        onDataReceived(data.data);
        toast({
          title: "Success",
          description: "Website data extracted successfully",
        });
      } else {
        throw new Error(data.message || 'Unknown API error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract data';
      toast({
        title: "Error extracting data",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="admin-card mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Extract Tool Data from Website</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>Example URLs to test: <code>https://www.openai.com/chatgpt</code>, <code>https://www.anthropic.com/claude</code>, or <code>https://www.perplexity.ai</code></p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-grow">
            <Input
              type="url"
              placeholder="Enter website URL (e.g., https://www.openai.com/chatgpt)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="admin-input"
            />
          </div>
          <Button 
            type="submit" 
            className="admin-button" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              'Extract Data'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlSubmissionForm;
