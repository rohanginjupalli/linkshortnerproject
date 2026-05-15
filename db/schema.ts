import {
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from 'drizzle-orm/pg-core';

export const links = pgTable(
	'links',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id').notNull(),
		shortCode: text('short_code').notNull(),
		url: text('url').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		shortCodeIdx: uniqueIndex('links_short_code_unique').on(table.shortCode),
		userIdIdx: index('links_user_id_idx').on(table.userId),
	}),
);
