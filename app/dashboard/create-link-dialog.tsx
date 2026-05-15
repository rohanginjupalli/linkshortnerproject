'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, type JSX, useState, useTransition } from 'react';
import { Link2, Plus } from 'lucide-react';

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

import { createLinkAction, type CreateLinkResult } from './action';

type CreateLinkDialogProps = {
  className?: string;
};

export function CreateLinkDialog({ className }: CreateLinkDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<CreateLinkResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen);

    if (nextOpen) {
      setError(null);
      setUrl('');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);

    startTransition(() => {
      void (async () => {
        const result = await createLinkAction({ url });

        if (!result.success) {
          setError(result.message);
          return;
        }

        setCreatedLink(result);
        setOpen(false);
        setUrl('');
        router.refresh();
      })();
    });
  }

  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto" size="lg">
            <Plus className="size-4" />
            Create link
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create a short link</DialogTitle>
              <DialogDescription>
                Paste a destination URL and we&apos;ll generate a clean short link for you.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="destination-url">Destination URL</Label>
              <Input
                id="destination-url"
                name="destination-url"
                placeholder="https://example.com/campaign"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                disabled={isPending}
                autoComplete="url"
                required
              />
              <p className="text-xs leading-5 text-muted-foreground">
                You can paste a full URL or a bare domain. We normalize it before saving.
              </p>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || url.trim().length === 0}>
                {isPending ? 'Creating...' : 'Create link'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {createdLink ? (
        <div className="mt-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground shadow-sm">
          <div className="flex items-start gap-2">
            <Link2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Link created</p>
              <Link href={createdLink.shortUrl} className="break-all text-primary underline">
                {createdLink.shortUrl}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}