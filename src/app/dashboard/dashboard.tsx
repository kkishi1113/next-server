'use client';

import { useState } from 'react';
import { AddLinkFormContainer } from './add-link-form';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/types';
import { SavedLinks } from './saved-links';
import { ArchivedLinks } from './archived-links';
import { NoLinks } from './no-links';
import { TooltipProvider } from '@/components/ui/tooltip';

type DashboardProps = {
  initialLinks: Link[];
};

export default function Dashboard({ initialLinks }: DashboardProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const savedLinks = links.filter((link) => !link.archived);
  const archivedLinks = links.filter((link) => link.archived);

  console.log('🍎🍎🍎');
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Page Stacker</h1>
        <p className="text-center text-muted-foreground">
          Save and organize your web links in one place
        </p>
      </header>

      <AddLinkFormContainer links={links} setLinks={setLinks} />
      {/* <LinkCardList links={links} setLinks={setLinks} /> */}

      <div className="flex justify-between items-center mb-4">
        <TooltipProvider>
          <Tabs defaultValue="saved">
            <TabsList>
              <TabsTrigger value="saved">{`Saved (${savedLinks.length})`}</TabsTrigger>
              <TabsTrigger value="archived">
                {`Archived (${archivedLinks.length})`}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="saved" className="mt-0">
              <SavedLinks links={savedLinks} setLinks={setLinks} />
            </TabsContent>
            <TabsContent value="archived" className="mt-0">
              <ArchivedLinks links={archivedLinks} setLinks={setLinks} />
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </div>
      <Toaster />
    </main>
  );
}
