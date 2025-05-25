'use client';
import { LinkCard } from './link-card';
import { useIsMobile } from '@/hooks/use-mobile';

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
  return (
    <div
      className={`grid gap-4 ${
        isMobile ? '' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          setLinks={setLinks}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
