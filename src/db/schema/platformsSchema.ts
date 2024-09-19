import { pgTable, serial, varchar, text, boolean, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projectsTable } from './projectSchema';
import { nanoId } from '@/lib/utils';
import { createInsertSchema } from 'drizzle-zod';

// Platforms table
export const platformsTable = pgTable('platforms', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    iconName: varchar('icon_name', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Relation between integrations and platforms
export const integrationPlatformsTable = pgTable('integration_platforms', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(16)),
    integrationId: text('integration_id').references(() => integrationsTable.id),
    platformId: text('platform_id').references(() => platformsTable.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Integrations table
export const integrationsTable = pgTable('integrations', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    iconName: varchar('icon_name', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Project integrations table
export const projectIntegrationsTable = pgTable('project_integrations', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(16)),
    projectId: text('project_id').references(() => projectsTable.id),
    integrationId: text('integration_id').references(() => integrationsTable.id),
    isConnected: boolean('is_connected').default(false),
    config: jsonb('config'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Integration auth tokens table
export const integrationAuthTokensTable = pgTable('integration_auth_tokens', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(16)),
    projectIntegrationId: text('project_integration_id').references(() => projectIntegrationsTable.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// type 
export type Platforms = typeof platformsTable.$inferSelect;
export type NewPlatforms = typeof platformsTable.$inferInsert;
export type IntegrationPlatforms = typeof integrationPlatformsTable.$inferSelect;
export type NewIntegrationPlatforms = typeof integrationPlatformsTable.$inferInsert;
export type Integrations = typeof integrationsTable.$inferSelect;
export type ProjectIntegrations = typeof projectIntegrationsTable.$inferSelect;
export type NewProjectIntegrations = typeof projectIntegrationsTable.$inferInsert;
export type IntegrationAuthTokens = typeof integrationAuthTokensTable.$inferSelect;
export type NewIntegrationAuthTokens = typeof integrationAuthTokensTable.$inferInsert;

// schema
export const platformsSchema = createInsertSchema(platformsTable);
export const integrationPlatformsSchema = createInsertSchema(integrationPlatformsTable);
export const integrationsSchema = createInsertSchema(integrationsTable);
export const projectIntegrationsSchema = createInsertSchema(projectIntegrationsTable);
export const integrationAuthTokensSchema = createInsertSchema(integrationAuthTokensTable);
