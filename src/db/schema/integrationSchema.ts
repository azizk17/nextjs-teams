import { pgTable, serial, varchar, text, boolean, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { projectsTable } from './projectSchema';
import { nanoId } from '@/lib/utils';



export const integrations = pgTable('integrations', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    iconName: varchar('icon_name', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const projectIntegrations = pgTable('project_integrations', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(16)),
    projectId: integer('project_id').references(() => projectsTable.id),
    integrationId: integer('integration_id').references(() => integrations.id),
    isConnected: boolean('is_connected').default(false),
    config: jsonb('config'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const integrationAuthTokens = pgTable('integration_auth_tokens', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(16)),
    projectIntegrationId: text('project_integration_id').references(() => projectIntegrations.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const integrationsRelations = relations(integrations, ({ many }) => ({
    projectIntegrations: many(projectIntegrations),
}));

export const projectIntegrationsRelations = relations(projectIntegrations, ({ one }) => ({
    project: one(projectsTable, {
        fields: [projectIntegrations.projectId],
        references: [projectsTable.id],
    }),
    integration: one(integrations, {
        fields: [projectIntegrations.integrationId],
        references: [integrations.id],
    }),
    authToken: one(integrationAuthTokens, {
        fields: [projectIntegrations.id],
        references: [integrationAuthTokens.projectIntegrationId],
    }),
}));

export const integrationAuthTokensRelations = relations(integrationAuthTokens, ({ one }) => ({
    projectIntegration: one(projectIntegrations, {
        fields: [integrationAuthTokens.projectIntegrationId],
        references: [projectIntegrations.id],
    }),
}));