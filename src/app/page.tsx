'use client';

import type React from 'react';

import { useState } from 'react';
import { Archive, ArchiveX, Globe, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data for demonstration
const SAMPLE_LINKS = [
  {
    id: '1',
    title: 'Next.js Documentation - Learn how to use Next.js',
    url: 'https://nextjs.org/docs',
    domain: 'nextjs.org',
    thumbnail: '/placeholder.svg?height=200&width=300',
    archived: false,
  },
  {
    id: '2',
    title: 'Tailwind CSS - A utility-first CSS framework',
    url: 'https://tailwindcss.com',
    domain: 'tailwindcss.com',
    thumbnail: '/placeholder.svg?height=200&width=300',
    archived: false,
  },
  {
    id: '3',
    title: 'React - A JavaScript library for building user interfaces',
    url: 'https://reactjs.org',
    domain: 'reactjs.org',
    thumbnail: '/placeholder.svg?height=200&width=300',
    archived: false,
  },
  {
    id: '4',
    title: 'Vercel - Develop. Preview. Ship.',
    url: 'https://vercel.com',
    domain: 'vercel.com',
    thumbnail: '/placeholder.svg?height=200&width=300',
    archived: true,
  },
  {
    id: '5',
    title: 'GitHub - Where the world builds software',
    url: 'https://github.com',
    domain: 'github.com',
    thumbnail: '/placeholder.svg?height=200&width=300',
    archived: true,
  },
];

export default function Home() {
  const [links, setLinks] = useState(SAMPLE_LINKS);
  const [newUrls, setNewUrls] = useState('');
  const [activeTab, setActiveTab] = useState('saved');
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Split the input by newlines to get multiple URLs
    const urls = newUrls.split(/\n/).filter((url) => url.trim() !== '');

    if (urls.length > 0) {
      const newLinks = urls.map((url, index) => {
        // Extract domain from URL
        let domain = '';
        try {
          domain = new URL(url).hostname;
        } catch {
          domain = url;
        }

        return {
          id: `new-${Date.now()}-${index}`,
          title: `New page from ${domain}`,
          url,
          domain,
          thumbnail: '/placeholder.svg?height=200&width=300',
          archived: false,
        };
      });

      setLinks([...newLinks, ...links]);
      setNewUrls('');
    }
  };

  const toggleArchive = (id: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, archived: !link.archived } : link
      )
    );
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
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

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Add New Links</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Paste one or multiple URLs (each on a new line)
          </p>
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="https://example.com&#10;https://another-site.com"
              value={newUrls}
              onChange={(e) => setNewUrls(e.target.value)}
              className="min-h-[100px] bg-background"
            />
            <Button type="submit" className="self-end">
              <Plus className="h-4 w-4 mr-2" />
              Save Links
            </Button>
          </div>
        </div>
      </form>

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
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                No saved links yet. Add some links above!
              </p>
            </div>
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
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No archived links yet.</p>
            </div>
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

interface LinkCardProps {
  link: {
    id: string;
    title: string;
    url: string;
    domain: string;
    thumbnail: string;
    archived: boolean;
  };
  onArchive: () => void;
  onDelete: () => void;
  isMobile: boolean;
}

function LinkCard({ link, onArchive, onDelete, isMobile }: LinkCardProps) {
  return (
    <div
      className={`border rounded-lg overflow-hidden bg-background ${
        isMobile ? 'flex' : ''
      }`}
    >
      <div
        className={`${
          isMobile ? 'w-1/3 flex-shrink-0' : 'w-full aspect-video'
        }`}
      >
        <Image
          src={link.thumbnail || '/placeholder.svg'}
          alt={link.title}
          width={300}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`p-4 ${isMobile ? 'w-2/3' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2">{link.title}</h3>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onArchive}
              title={link.archived ? 'Unarchive' : 'Archive'}
            >
              {link.archived ? (
                <ArchiveX className="h-4 w-4" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={onDelete}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm text-muted-foreground">
          <Globe className="h-3 w-3 mr-1" />
          <span>{link.domain}</span>
        </div>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm text-primary hover:underline block truncate"
        >
          {link.url}
        </a>
      </div>
    </div>
  );
}
