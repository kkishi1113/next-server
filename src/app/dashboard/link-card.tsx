'use client';

import React from 'react';
import { Globe, ImageIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from '@/types';
import { ArchiveTooltip } from './archive-tooltip';
import { DeleteDialog } from './delete-dialog';

interface LinkCardProps {
  link: Link;
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
  isMobile: boolean;
}

export function LinkCard({ link, setLinks, isMobile }: LinkCardProps) {
  console.log('🍎🍎');

  return (
    <Card className={`overflow-hidden ${isMobile ? 'flex' : ''}`}>
      <div
        className={`${
          isMobile ? 'w-1/3 flex-shrink-0' : 'w-full aspect-video'
        }`}
      >
        <AspectRatio ratio={16 / 9}>
          {link.thumbnail !== '' ? (
            <img
              src={link.thumbnail}
              alt={link.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-full h-full bg-muted" />
          )}
        </AspectRatio>
      </div>
      <div className={`${isMobile ? 'w-2/3' : ''}`}>
        {/* Memo: タブ切り替え時にCardHeaderの処理が重い。 */}
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium line-clamp-2">{link.title}</h3>
            <div className="flex gap-1 flex-shrink-0">
              <DeleteDialog link={link} setLinks={setLinks} />
              <ArchiveTooltip link={link} setLinks={setLinks} />
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
