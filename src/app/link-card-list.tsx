'use client';

import type React from 'react';

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

import { fetchMetadata } from './actions/fetchMetadata';
import LinkCard from './link-card';

interface Link {
  id: string;
  title: string;
  url: string;
  domain: string;
  thumbnail: string;
  archived: boolean;
}

export default function LinkCardList({
  initialLinks,
}: {
  initialLinks: Link[];
}) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [newUrls, setNewUrls] = useState('');
  const [activeTab, setActiveTab] = useState('saved');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Split the input by newlines to get multiple URLs
    const urls = newUrls.split(/\n/).filter((url) => url.trim() !== '');

    if (urls.length > 0) {
      setIsLoading(true);

      try {
        const newLinks = await Promise.all(
          urls.map(async (url, index) => {
            // Extract domain from URL
            let domain = '';
            try {
              domain = new URL(url).hostname;
            } catch {
              domain = url;
            }

            // Fetch metadata for the URL
            let title = `New page from ${domain}`;
            let thumbnail = '/placeholder.svg?height=200&width=300';

            try {
              const metadata = await fetchMetadata(url);
              if (metadata.title) title = metadata.title;
              if (metadata.image) thumbnail = metadata.image;
            } catch (error) {
              console.error('Error fetching metadata:', error);
            }

            return {
              id: `new-${Date.now()}-${index}`,
              title,
              url,
              domain,
              thumbnail,
              archived: false,
            };
          })
        );

        setLinks([...newLinks, ...links]);
        setNewUrls('');

        toast('Links added successfully', {
          description: `Added ${newLinks.length} new links to your collection.`,
        });
      } catch (error) {
        toast.error('Error adding links', {
          description:
            'There was a problem processing your links. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleArchive = (id: string) => {
    setLinks(
      links.map((link) => {
        if (link.id === id) {
          const newState = !link.archived;
          toast(newState ? 'Link archived' : 'Link restored', {
            description: newState
              ? 'The link has been moved to archives.'
              : 'The link has been restored to saved links.',
          });
          return { ...link, archived: newState };
        }
        return link;
      })
    );
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
    toast('Link deleted', {
      description: 'The link has been permanently removed.',
    });
  };

  const savedLinks = links.filter((link) => !link.archived);
  const archivedLinks = links.filter((link) => link.archived);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Page Stacker</h1>
        <p className="text-center text-muted-foreground">
          Save and organize your web links in one place
        </p>
      </header>

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

      <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="saved">Saved ({savedLinks.length})</TabsTrigger>
            <TabsTrigger value="archived">
              Archived ({archivedLinks.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="saved" className="mt-0">
          {savedLinks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  No saved links yet. Add some links above!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid gap-4 ${
                isMobile ? '' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {savedLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onArchive={() => toggleArchive(link.id)}
                  onDelete={() => deleteLink(link.id)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-0">
          {archivedLinks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No archived links yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={`grid gap-4 ${
                isMobile ? '' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {archivedLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onArchive={() => toggleArchive(link.id)}
                  onDelete={() => deleteLink(link.id)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
