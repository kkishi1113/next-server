import { Link } from '@/types';
import { SetStateAction } from 'react';
import { LinkCardList } from './link-card-list';

type ArchivedLinksProps = {
  links: Link[];
  setLinks: React.Dispatch<SetStateAction<Link[]>>;
};

export function ArchivedLinks({ links, setLinks }: ArchivedLinksProps) {
  return (
    <>
      <LinkCardList links={links} setLinks={setLinks} />
    </>
  );
}
