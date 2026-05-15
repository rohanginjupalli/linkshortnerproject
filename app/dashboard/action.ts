'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import { createUserLink } from '@/data/links';

const createLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'Enter a destination URL.')
    .transform((value) => (value.match(/^https?:\/\//i) ? value : `https://${value}`))
    .pipe(z.string().url('Enter a valid URL.')),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export type CreateLinkResult =
  | {
      success: true;
      shortCode: string;
      shortUrl: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<CreateLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: 'User must be authenticated' };
  }

  const parsedInput = createLinkSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, message: parsedInput.error.issues[0]?.message ?? 'Invalid link data' };
  }

  const createdLink = await createUserLink(userId, parsedInput.data.url);

  if (!createdLink) {
    return { success: false, message: 'Unable to create link' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    success: true,
    shortCode: createdLink.shortCode,
    shortUrl: `${baseUrl}/${createdLink.shortCode}`,
  };
}