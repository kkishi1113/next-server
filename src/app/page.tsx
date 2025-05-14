'use server';
import type React from 'react';

import LinkCardList from './link-card-list';
import { getLinks } from './get-links';

export default async function Home() {
  const initialLinks = await getLinks();

  return <LinkCardList initialLinks={initialLinks} />;
}
