import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="flex flex-1 justify-center px-6 py-16">
      <div className="w-full max-w-5xl space-y-14">
        <section className="space-y-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            LinkShortener
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Shorten links, share smarter, and track what matters.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            LinkShortener helps you create clean short URLs, manage them in one
            place, and keep your links organized for every campaign.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <SignUpButton mode="modal">
              <Button size="lg">Get Started Free</Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">Sign In</Button>
            </SignInButton>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Instant Short Links</CardTitle>
              <CardDescription>
                Convert long URLs into short, shareable links in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Keep your posts clean and easier to remember across social media,
              email, and chats.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Secure User Dashboard</CardTitle>
              <CardDescription>
                Sign in with Clerk and access your links from one protected
                dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Your link workspace is tied to your account, so only you can view
              and manage it.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Built for Growth</CardTitle>
              <CardDescription>
                Organize and maintain your shortened links as your usage scales.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              From quick personal sharing to recurring campaigns, keep links
              tidy and consistent.
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm shadow-black/20">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            Ready to try it?
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Create your first short link in under a minute.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Sign up to open your dashboard and start shortening URLs with a
            clean, focused workflow.
          </p>
          <div className="mt-6 flex justify-center">
            <SignUpButton mode="modal">
              <Button size="lg">Create Account</Button>
            </SignUpButton>
          </div>
        </section>
      </div>
    </main>
  );
}
