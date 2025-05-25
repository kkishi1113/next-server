import { useCallback } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Archive, ArchiveX } from 'lucide-react';
import { Link } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type LinkCardActionsProps = {
  link: Link;
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
};

export function ArchiveTooltip({ link, setLinks }: LinkCardActionsProps) {
  const handleToggleArchive = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/links/${id}/archive`, {
          method: 'PATCH',
        });
        const data = await res.json();

        setLinks((prevLinks) => [
          ...prevLinks.filter((prevLink) => prevLink.id !== link.id),
          { ...link, archived: data.archived },
        ]);

        toast(data.archived ? 'Link archived' : 'Link restored', {
          description: data.archived
            ? 'The link has been moved to archives.'
            : 'The link has been restored to saved links.',
        });
      } catch (error) {
        console.log(error);
      }
    },
    [setLinks]
  );
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToggleArchive(link.id)}
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
  );
}
