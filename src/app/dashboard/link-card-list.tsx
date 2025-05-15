'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LinkCard from './link-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { toast } from 'sonner';

interface Link {
  id: string;
  title: string;
  url: string;
  domain: string;
  thumbnail: string;
  archived: boolean;
}

type LinkCardListProps = {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
};

export function LinkCardList({ links, setLinks }: LinkCardListProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('saved');
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
    <>
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
    </>
  );
}
