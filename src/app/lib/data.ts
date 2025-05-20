import { openDb } from '@/utils/db';

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
export async function fetchLinks(): Promise<Link[]> {
  // let links: Link[] = [];
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const db = await openDb();
    const links = await db.all('SELECT * FROM links');
    return links;

    // const res = await fetch('https://api.example.com/links', {
    //   cache: 'no-store',
    // });
    // const res = await fetch(`${baseUrl}/api`, {
    //   // method: 'GET',
    //   // body: JSON.stringify({ links: [...newLinks] }),
    //   // headers: { 'Content-Type': 'application/json' },
    //   cache: 'no-store',
    // });
    // if (!res.ok) {
    //   throw new Error(`Fetch failed with status ${res.status}`);
    // }
    // links = await res.json();
  } catch (error) {
    console.error(
      'リンクの取得に失敗しました。SAMPLE_LINKSを使用します:',
      error
    );
    return SAMPLE_LINKS;
  }
}
