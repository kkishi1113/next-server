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

import { Link } from '@/types';
import { Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

type LinkCardPortalProps = {
  link: Link;
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
};

export function DeleteDialog({ link, setLinks }: LinkCardPortalProps) {
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
  );
}
