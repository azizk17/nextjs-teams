import { pgTable, serial, varchar, text, boolean, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projectsTable } from './projectSchema';
import { nanoId } from '@/lib/utils';



export const integrationsTable = pgTable('integrations', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    iconName: varchar('icon_name', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const projectIntegrationsTable = pgTable('project_integrations', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(16)),
    projectId: text('project_id').references(() => projectsTable.id),
    integrationId: text('integration_id').references(() => integrationsTable.id),
    isConnected: boolean('is_connected').default(false),
    config: jsonb('config'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const integrationAuthTokensTable = pgTable('integration_auth_tokens', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(16)),
    projectIntegrationId: text('project_integration_id').references(() => projectIntegrationsTable.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const integrationsRelations = relations(integrationsTable, ({ many }) => ({
    projectIntegrations: many(projectIntegrationsTable),
}));

export const projectIntegrationsRelations = relations(projectIntegrationsTable, ({ one }) => ({
    project: one(projectsTable, {
        fields: [projectIntegrationsTable.projectId],
        references: [projectsTable.id],
    }),
    integration: one(integrationsTable, {
        fields: [projectIntegrationsTable.integrationId],
        references: [integrationsTable.id],
    }),
    authToken: one(integrationAuthTokensTable, {
        fields: [projectIntegrationsTable.id],
        references: [integrationAuthTokensTable.projectIntegrationId],
    }),
}));

export const integrationAuthTokensRelations = relations(integrationAuthTokensTable, ({ one }) => ({
    projectIntegration: one(projectIntegrationsTable, {
        fields: [integrationAuthTokensTable.projectIntegrationId],
        references: [projectIntegrationsTable.id],
    }),
}));