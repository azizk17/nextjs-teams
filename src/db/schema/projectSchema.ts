import { pgTable, text, timestamp, primaryKey, integer, boolean, unique, json, serial, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { nanoId } from '@/lib/utils';
import { usersTable } from './userSchema';
import { teamsTable } from './teamSchema';
import { integrationsTable } from './platformsSchema';
// Projects table
export const projectsTable = pgTable('projects', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    avatar: text('avatar'),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    ownerId: text('owner_id').notNull().references(() => usersTable.id),
});

// Team Projects table
export const teamProjectsTable = pgTable('team_projects', {
    teamId: text('team_id').notNull().references(() => teamsTable.id),
    projectId: text('project_id').notNull().references(() => projectsTable.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.teamId, t.projectId] }),
}));

// Messages table
export const messagesTable = pgTable('messages', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(16)),
    projectId: text('project_id').notNull().references(() => projectsTable.id),
    senderId: text('sender_id').references(() => usersTable.id),
    integrationId: text('integration_id').references(() => integrationsTable.id),
    content: text('content').notNull(),
    messageType: text('message_type').notNull().default('user'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});




export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;
export const projectSchema = createInsertSchema(projectsTable);
