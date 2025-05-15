'use client';

import type React from 'react';

import { useState } from 'react';
import { Archive, ArchiveX, Globe, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import Image from 'next/image';

interface Link {
  id: string;
  title: string;
  url: string;
  domain: string;
  thumbnail: string;
  archived: boolean;
}

interface LinkCardProps {
  link: Link;
  onArchive: () => void;
  onDelete: () => void;
  isMobile: boolean;
}

export default function LinkCard({
  link,
  onArchive,
  onDelete,
  isMobile,
}: LinkCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Card className={`overflow-hidden ${isMobile ? 'flex' : ''}`}>
      <div
        className={`${
          isMobile ? 'w-1/3 flex-shrink-0' : 'w-full aspect-video'
        }`}
      >
        <img
          src={link.thumbnail || '/placeholder.svg?height=200&width=300'}
          alt={link.title}
          width={300}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`${isMobile ? 'w-2/3' : ''}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium line-clamp-2">{link.title}</h3>
            <div className="flex gap-1 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onArchive}
                    >
                      {link.archived ? (
                        <ArchiveX className="h-4 w-4" />
                      ) : (
                        <Archive className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {link.archived ? 'Restore from archive' : 'Move to archive'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Link</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this link? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onDelete();
                        setDeleteDialogOpen(false);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Globe className="h-3 w-3 mr-1" />
            <span>{link.domain}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline block truncate"
          >
            {link.url}
          </a>
        </CardFooter>
      </div>
    </Card>
  );
}
