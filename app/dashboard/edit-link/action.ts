'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import { updateUserLink } from '@/data/links';

const editLinkSchema = z.object({
  id: z.string().trim().min(1, 'Invalid link id'),
  url: z
    .string()
    .trim()
    .min(1, 'Enter a destination URL.')
    .transform((value) => (value.match(/^https?:\/\//i) ? value : `https://${value}`))
    .pipe(z.string().url('Enter a valid URL.')),
});

export type EditLinkInput = z.infer<typeof editLinkSchema>;

export type EditLinkResult =
  | {
      success: true;
      id: string;
      shortCode: string;
      url: string;
      createdAt: Date;
      updatedAt: Date;
    }
  | {
      success: false;
      message: string;
    };

export async function editLinkAction(input: EditLinkInput): Promise<EditLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: 'User must be authenticated' };
  }

  const parsed = editLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }

  const updated = await updateUserLink(userId, parsed.data.id, parsed.data.url);

  if (!updated) {
    return { success: false, message: 'Link not found or not owned by user' };
  }

  return {
    success: true,
    id: updated.id,
    shortCode: updated.shortCode,
    url: updated.url,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  } as const;
}