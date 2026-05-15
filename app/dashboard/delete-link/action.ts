'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import { deleteUserLink } from '@/data/links';

const deleteLinkSchema = z.object({
  id: z.string().trim().min(1, 'Invalid link id'),
});

export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export type DeleteLinkResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function deleteLinkAction(input: DeleteLinkInput): Promise<DeleteLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: 'User must be authenticated' };
  }

  const parsed = deleteLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }

  const ok = await deleteUserLink(userId, parsed.data.id);

  if (!ok) {
    return { success: false, message: 'Link not found or not owned by user' };
  }

  return { success: true };
}