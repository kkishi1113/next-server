'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Link {
  id: string;
  title: string;
  url: string;
  domain: string;
  thumbnail: string;
  archived: boolean;
}

type AddLinkFormProps = {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
};

export function AddLinkFormContainer({ links, setLinks }: AddLinkFormProps) {
  const [newUrls, setNewUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Split the input by newlines to get multiple URLs
    const urls = newUrls.split(/\n/).filter((url) => url.trim() !== '');
    console.log('🍎', urls);

    try {
      setIsLoading(true);
      const res = await fetch('/api/links', {
        method: 'POST',
        body: JSON.stringify({ urls: urls }),
        headers: { 'Content-Type': 'application/json' },
      });

      const { newLinks }: { newLinks: Link[] } = await res.json();
      console.log(res);

      setLinks([...links, ...newLinks]);
      setNewUrls('');

      toast('Links added successfully', {
        description: `Added ${urls.length} new links to your collection.`,
      });
    } catch (error) {
      console.error(error);
      toast.error('Error adding links', {
        description:
          'There was a problem processing your links. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-lg font-medium">Add New Links</h2>
        <p className="text-sm text-muted-foreground">
          Paste one or multiple URLs (each on a new line)
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            placeholder="https://example.com&#10;https://another-site.com"
            value={newUrls}
            onChange={(e) => setNewUrls(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" className="self-end" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Save Links
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
