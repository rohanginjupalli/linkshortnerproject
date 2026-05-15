import { db } from '@/db';
import { links } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';

export type UserLink = {
  id: string;
  shortCode: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};

async function isShortCodeAvailable(shortCode: string): Promise<boolean> {
  const rows = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return rows.length === 0;
}

function generateShortCode(length = 7): string {
  return randomBytes(length).toString('base64url').slice(0, length);
}

function isUniqueConstraintViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === '23505';
}

export async function getUserLinks(userId?: string): Promise<UserLink[]> {
  if (!userId) return [];

  try {
    const rows = await db.select().from(links).where(eq(links.userId, userId));

    return rows.map((r) => ({
      id: r.id,
      shortCode: r.shortCode,
      url: r.url,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  } catch (error) {
    console.error('getUserLinks error:', error);
    return [];
  }
}

export async function createUserLink(userId: string, url: string): Promise<UserLink | null> {
  try {
    let shortCode = generateShortCode();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      if (!(await isShortCodeAvailable(shortCode))) {
        shortCode = generateShortCode();
        continue;
      }

      try {
        const rows = await db
          .insert(links)
          .values({
            userId,
            shortCode,
            url,
          })
          .returning();

        const createdLink = rows[0];

        if (!createdLink) {
          return null;
        }

        return {
          id: createdLink.id,
          shortCode: createdLink.shortCode,
          url: createdLink.url,
          createdAt: createdLink.createdAt,
          updatedAt: createdLink.updatedAt,
        };
      } catch (error) {
        if (attempt < 4 && isUniqueConstraintViolation(error)) {
          shortCode = generateShortCode();
          continue;
        }

        return null;
      }
    }

    return null;
  } catch (error) {
    console.error('createUserLink error:', error);
    return null;
  }
}

export async function updateUserLink(userId: string, linkId: string, url: string): Promise<UserLink | null> {
  try {
    const rows = await db
      .update(links)
      .set({ url, updatedAt: new Date() })
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .returning();

    const updated = rows[0] ?? null;

    if (!updated) {
      return null;
    }

    return {
      id: updated.id,
      shortCode: updated.shortCode,
      url: updated.url,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  } catch (error) {
    console.error('updateUserLink error:', error);
    return null;
  }
}

export async function deleteUserLink(userId: string, linkId: string): Promise<boolean> {
  try {
    const rows = await db
      .delete(links)
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .returning({ id: links.id });

    return rows.length > 0;
  } catch (error) {
    console.error('deleteUserLink error:', error);
    return false;
  }
}
