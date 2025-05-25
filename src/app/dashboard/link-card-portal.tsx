import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link } from '@/types';
import { Archive, ArchiveX, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

type LinkCardPortalProps = {
  link: Link;
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
};

export function LinkCardPortal({ link, setLinks }: LinkCardPortalProps) {
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

  const handleDeleteLink = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/links/${id}/delete`, {
          method: 'DELETE',
        });
        const data = await res.json();

        setLinks((prevLinks) =>
          prevLinks.filter((prevLink) => prevLink.id !== link.id)
        );
        toast('Link deleted', {
          description: 'The link has been permanently removed.',
        });
      } catch (error) {
        console.error(error);
      }
    },
    [setLinks]
  );

  return (
    <>
      <TooltipProvider>
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
      </TooltipProvider>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this link? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => handleDeleteLink(link.id)}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
