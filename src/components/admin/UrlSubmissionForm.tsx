// UrlSubmissionForm.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AITool } from '@/types/admin';
import { Loader2, Info } from 'lucide-react';

interface UrlSubmissionFormProps {
  onDataReceived: (data: AITool) => void;
}

const UrlSubmissionForm: React.FC<UrlSubmissionFormProps> = ({
  onDataReceived
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast({ title: "Error", description: "Please enter a URL", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (json.agent_data) {
        onDataReceived(json.agent_data);
        toast({ title: "Success", description: "Data extracted successfully" });
      } else {
        throw new Error(json.detail || 'Invalid response');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Extraction failed';
      toast({ title: "Error", description: msg, variant: "destructive" });
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
          <p>Try URLs like <code>https://www.openai.com/chatgpt</code></p>
        </div>

        {/* Changed from <form> to <div> to avoid nesting inside another form */}
        <div className="flex gap-3">
          <div className="flex-grow">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="admin-input"
            />
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            className="admin-button"
            disabled={isLoading}
          >
            {isLoading
              ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              : 'Extract Data'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UrlSubmissionForm;
