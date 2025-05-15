'use client';

import type React from 'react';

import { useState } from 'react';
import { Link } from 'lucide-react';

import { LinkCardList } from './link-card-list';
import { AddLinkFormContainer } from './add-link-form';

interface Link {
  id: string;
  title: string;
  url: string;
  domain: string;
  thumbnail: string;
  archived: boolean;
}

type DashboardProps = {
  initialLinks: Link[];
};

export default function Dashboard({ initialLinks }: DashboardProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Page Stacker</h1>
        <p className="text-center text-muted-foreground">
          Save and organize your web links in one place
        </p>
      </header>

      <AddLinkFormContainer links={links} setLinks={setLinks} />
      <LinkCardList links={links} setLinks={setLinks} />
    </main>
  );
}
