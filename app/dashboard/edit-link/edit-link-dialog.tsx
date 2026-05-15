'use client';

import { useState, useTransition, type FormEvent, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { editLinkAction } from './action';

type Props = {
  link: {
    id: string;
    url: string;
  };
};

export function EditLinkDialog({ link }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(link.url);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setError(null);
      setUrl(link.url);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(() => {
      void (async () => {
        const result = await editLinkAction({ id: link.id, url });

        if (!result.success) {
          setError(result.message);
          return;
        }

        setOpen(false);
        router.refresh();
      })();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit link</DialogTitle>
            <DialogDescription>Update the destination URL for this short link.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor={`edit-url-${link.id}`}>Destination URL</Label>
            <Input id={`edit-url-${link.id}`} value={url} onChange={(e) => setUrl(e.target.value)} required />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || url.trim().length === 0}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditLinkDialog;