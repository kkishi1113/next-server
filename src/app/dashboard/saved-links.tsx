import { Link } from '@/types';
import { SetStateAction } from 'react';
import { LinkCardList } from './link-card-list';
import { NoLinks } from './no-links';

type SavedLinksProps = {
  links: Link[];
  setLinks: React.Dispatch<SetStateAction<Link[]>>;
};

export function SavedLinks({ links, setLinks }: SavedLinksProps) {
  if (links.length === 0) return <NoLinks />;
  return <LinkCardList links={links} setLinks={setLinks} />;
}
