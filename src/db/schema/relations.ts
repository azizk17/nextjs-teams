import { relations } from 'drizzle-orm';
import { permissionsTable, rolePermissionsTable, rolesTable, userRolesTable, usersTable } from './userSchema';
import { teamMemberRolesTable, teamMembersTable, teamsTable } from './teamSchema';
import { projectsTable, teamProjectsTable } from './projectSchema';
import { platformsTable, integrationPlatformsTable, integrationsTable, projectIntegrationsTable, integrationAuthTokensTable } from './platformsSchema';
import { authorsTable, topicsTable, collectionsTable, mediaAuthorsTable, mediaTopicsTable, mediaTable, mediaTagsTable, mediaToCollectionsTable, subtitlesTable, tagsTable } from './mediaSchema';
import { postsTable } from './channelSchema';
import { categoriesTable, postCategoriesTable, postMediaTable, postTagsTable } from './postSchema';



// Relations
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

export const usersRelations = relations(usersTable, ({ many }) => ({
    roles: many(userRolesTable),
    memberOf: many(teamMembersTable),
    projects: many(projectsTable),
    teams: many(teamsTable),
}));

export const rolesRelations = relations(rolesTable, ({ many }) => ({
    users: many(userRolesTable),
    permissions: many(rolePermissionsTable),
    teamMembers: many(teamMemberRolesTable),
}));
export const userRolesRelations = relations(userRolesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userRolesTable.userId],
        references: [usersTable.id],
    }),
    role: one(rolesTable, {
        fields: [userRolesTable.roleId],
        references: [rolesTable.id],
    }),
}));

export const permissionsRelations = relations(permissionsTable, ({ many }) => ({
    roles: many(rolePermissionsTable),
}));
export const rolePermissionsRelations = relations(rolePermissionsTable, ({ one }) => ({
    role: one(rolesTable, {
        fields: [rolePermissionsTable.roleId],
        references: [rolesTable.id],
    }),
    permission: one(permissionsTable, {
        fields: [rolePermissionsTable.permissionId],
        references: [permissionsTable.id],
    }),
}));

export const projectsRelations = relations(projectsTable, ({ many, one }) => ({
    teams: many(teamProjectsTable),
    owner: one(usersTable, {
        fields: [projectsTable.ownerId],
        references: [usersTable.id],
    }),
}));

export const teamsRelations = relations(teamsTable, ({ many, one }) => ({
    projects: many(teamProjectsTable),
    members: many(teamMembersTable),
    owner: one(usersTable, {
        fields: [teamsTable.ownerId],
        references: [usersTable.id],
    }),
}));
export const teamProjectsRelations = relations(teamProjectsTable, ({ one }) => ({
    team: one(teamsTable, {
        fields: [teamProjectsTable.teamId],
        references: [teamsTable.id],
    }),
    project: one(projectsTable, {
        fields: [teamProjectsTable.projectId],
        references: [projectsTable.id],
    }),
}));
export const teamMembersRelations = relations(teamMembersTable, ({ one, many }) => ({
    team: one(teamsTable, {
        fields: [teamMembersTable.teamId],
        references: [teamsTable.id],
    }),
    user: one(usersTable, {
        fields: [teamMembersTable.userId],
        references: [usersTable.id],
    }),
    roles: many(teamMemberRolesTable),
}));

export const teamMemberRolesRelations = relations(teamMemberRolesTable, ({ one }) => ({
    member: one(teamMembersTable, {
        fields: [teamMemberRolesTable.teamMemberId],
        references: [teamMembersTable.id],
    }),
    role: one(rolesTable, {
        fields: [teamMemberRolesTable.roleId],
        references: [rolesTable.id],
    }),
}));


// Platforms relations
export const platformsRelations = relations(platformsTable, ({ many }) => ({
    posts: many(postsTable),
    integrations: many(integrationPlatformsTable),
    media: many(mediaTable),
    authors: many(authorsTable),

}));

export const integrationPlatformsRelations = relations(integrationPlatformsTable, ({ one }) => ({
    integration: one(integrationsTable, {
        fields: [integrationPlatformsTable.integrationId],
        references: [integrationsTable.id],
    }),
    platform: one(platformsTable, {
        fields: [integrationPlatformsTable.platformId],
        references: [platformsTable.id],
    }),
}));

export const integrationsRelations = relations(integrationsTable, ({ many }) => ({
    projectIntegrations: many(projectIntegrationsTable),
    platforms: many(integrationPlatformsTable),
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

// Posts Relations
export const postsRelations = relations(postsTable, ({ many, one }) => ({
    platform: one(platformsTable),
    author: one(mediaAuthorsTable),
    tags: many(postTagsTable),
    categories: many(postCategoriesTable),
    media: many(postMediaTable),
}));

export const postTagsRelations = relations(postTagsTable, ({ one }) => ({
    post: one(postsTable),
    tag: one(tagsTable),
}));

export const postCategoriesRelations = relations(postCategoriesTable, ({ one }) => ({
    post: one(postsTable),
    category: one(categoriesTable),
}));

export const postMediaRelations = relations(postMediaTable, ({ one }) => ({
    post: one(postsTable),
    media: one(mediaTable),
}));



// Media Relations
export const mediaRelations = relations(mediaTable, ({ many, one }) => ({
    collections: many(mediaToCollectionsTable),
    tags: many(mediaTagsTable),
    topics: many(mediaTopicsTable),
    author: one(mediaAuthorsTable),
    subtitles: many(subtitlesTable),
}));

export const subtitleRelations = relations(subtitlesTable, ({ one }) => ({
    media: one(mediaTable),
}));

export const authorRelations = relations(authorsTable, ({ many, one }) => ({
    media: many(mediaTable),
    platform: one(platformsTable),
}));

export const collectionRelations = relations(collectionsTable, ({ many }) => ({
    media: many(mediaToCollectionsTable),
}));

export const tagRelations = relations(tagsTable, ({ many }) => ({
    media: many(mediaTagsTable),
}));

export const topicRelations = relations(topicsTable, ({ many, one }) => ({
    media: many(mediaTopicsTable),
    parent: one(topicsTable, {
        fields: [topicsTable.parentId],
        references: [topicsTable.id],
    }),
    children: many(topicsTable),
}));



