'use client';

import { useState } from 'react';
import { LinkCardList } from './link-card-list';
import { AddLinkFormContainer } from './add-link-form';
import { Toaster } from '@/components/ui/sonner';
import { LinkCardPortal } from './link-card-portal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/types';
import { SavedLinks } from './saved-links';
import { ArchivedLinks } from './archived-links';
import { NoLinks } from './no-links';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
        {/* <Dialog> */}
        <Tabs defaultValue="saved">
          <TabsList>
            <TabsTrigger value="saved">{`Saved (${savedLinks.length})`}</TabsTrigger>
            <TabsTrigger value="archived">
              {`Archived (${archivedLinks.length})`}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="saved" className="mt-0">
            {savedLinks.length === 0 ? (
              <NoLinks />
            ) : (
              <SavedLinks links={savedLinks} setLinks={setLinks} />
            )}
          </TabsContent>
          <TabsContent value="archived" className="mt-0">
            {archivedLinks.length === 0 ? (
              <NoLinks />
            ) : (
              <ArchivedLinks links={archivedLinks} setLinks={setLinks} />
            )}
          </TabsContent>
        </Tabs>
        {/* <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Link</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this link? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  // onClick={() => handleDeleteLink(link.id)}
                >
                  Delete
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent> */}
        {/* </Dialog> */}
      </div>

      {/* <LinkCardPortal /> */}
      <Toaster />
    </main>
  );
}
