import { Link } from '@/types';
import { SetStateAction } from 'react';
import { LinkCardList } from './link-card-list';

type SavedLinksProps = {
  links: Link[];
  setLinks: React.Dispatch<SetStateAction<Link[]>>;
};

export function SavedLinks({ links, setLinks }: SavedLinksProps) {
  return (
    <>
      <LinkCardList links={links} setLinks={setLinks} />
    </>
  );
}
