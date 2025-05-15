'use server';
import type React from 'react';

import Dashboard from './dashboard';
import { fetchMetadata } from '../actions/fetchMetadata';

export default async function DashboardContainer() {
  const initialLinks = await getLinks();

  return <Dashboard initialLinks={initialLinks} />;
}

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
];

interface Link {
  id: string;
  title: string;
  url: string;
  domain: string;
  thumbnail: string;
  archived: boolean;
}

// Node.js側でOGPを取得し、初期表示に使う
export async function getLinks(): Promise<Link[]> {
  let links: Link[] = [];

  try {
    const res = await fetch('https://api.example.com/links', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    links = await res.json();
  } catch (error) {
    console.error(
      'リンクの取得に失敗しました。SAMPLE_LINKSを使用します:',
      error
    );
    links = SAMPLE_LINKS;
  }

  const initialLinks: Link[] = await Promise.all(
    links.map(async (link) => {
      const metadata = await fetchMetadata(link.url);
      return {
        ...link,
        thumbnail: metadata.image ?? link.thumbnail,
      };
    })
  );

  return initialLinks;
}
