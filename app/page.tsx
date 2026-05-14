import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <section className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-sm shadow-black/20">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          Clerk is wired up
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Sign in to continue.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          The layout now includes ClerkProvider and the app is reading auth state
          on the server with Clerk&apos;s App Router API.
        </p>
        <div className="mt-8 flex gap-4">
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline">Sign Up</Button>
          </SignUpButton>
        </div>
      </section>
    </main>
  );
}
