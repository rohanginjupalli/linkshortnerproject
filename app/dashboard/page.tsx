import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { JSX } from 'react';

import { getUserLinks } from '@/data/links';
import Link from 'next/link';
import { CreateLinkDialog } from './create-link-dialog';
import EditLinkDialog from './edit-link/edit-link-dialog';
import { ConfirmDeleteDialog } from './delete-link/confirm-delete-dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default async function DashboardPage(): Promise<JSX.Element> {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const userLinks = await getUserLinks(userId);
  const sortedLinks = userLinks.slice().sort((a, b) => {
    const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return tb - ta;
  });

  return (
    <main className="flex flex-1 flex-col items-start justify-start px-6 py-12">
      <div className="mb-8 flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Your links
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Create short links, keep them organized, and manage everything from one place.
          </p>
        </div>

        <CreateLinkDialog className="w-full sm:w-auto" />
      </div>

      {sortedLinks.length === 0 ? (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>No links yet</CardTitle>
            <CardDescription>
              Create your first short link to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Use the create link button above to generate a short URL and add it to your dashboard.
          </CardContent>
        </Card>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4">
          {sortedLinks.map((link) => {
            const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/${link.shortCode}`;

            return (
              <Card key={link.id}>
                <CardHeader>
                  <CardTitle>{link.shortCode}</CardTitle>
                  <CardDescription className="truncate">{link.url}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <Link href={shortUrl} className="text-primary underline">
                      {shortUrl}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {link.createdAt ? new Date(link.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-4">
                  <div>
                    <Link href={`/dashboard/${link.id}`} className="text-sm text-foreground/80 hover:underline">
                      Manage
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <EditLinkDialog link={{ id: link.id, url: link.url }} />
                    <ConfirmDeleteDialog linkId={link.id} />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}