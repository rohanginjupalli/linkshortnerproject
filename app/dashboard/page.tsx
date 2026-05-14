import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { JSX } from 'react';

export default async function DashboardPage(): Promise<JSX.Element> {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        Dashboard
      </h1>
    </main>
  );
}