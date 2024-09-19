import { relations } from 'drizzle-orm';
import { permissionsTable, rolePermissionsTable, rolesTable, userRolesTable, usersTable } from './userSchema';
import { teamMemberRolesTable, teamMembersTable, teamsTable } from './teamSchema';
import { projectsTable, teamProjectsTable } from './projectSchema';
import { platformsTable, integrationPlatformsTable, integrationsTable, projectIntegrationsTable, integrationAuthTokensTable } from './platformsSchema';
import { postsTable, authorTable, postTagsTable, postMediaTable, categoriesTable, collectionsTable, mediaTable, mediaTagsTable, postCategoriesTable, postCollectionsTable, tagsTable } from './postSchema';



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


// Posts relations
export const postsRelations = relations(postsTable, ({ many, one }) => ({
    collections: many(postCollectionsTable),
    media: many(postMediaTable),
    tags: many(postTagsTable),
    categories: many(postCategoriesTable),
    author: one(authorTable, {
        fields: [postsTable.authorId],
        references: [authorTable.id],
    }),
    platform: one(platformsTable, {
        fields: [postsTable.platformId],
        references: [platformsTable.id],
    }),
}));

export const collectionsRelations = relations(collectionsTable, ({ many }) => ({
    posts: many(postCollectionsTable),
}));

export const postCollectionsRelations = relations(postCollectionsTable, ({ one }) => ({
    post: one(postsTable, {
        fields: [postCollectionsTable.postId],
        references: [postsTable.id],
    }),
    collection: one(collectionsTable, {
        fields: [postCollectionsTable.collectionId],
        references: [collectionsTable.id],
    }),
}));

export const postMediaRelations = relations(postMediaTable, ({ one }) => ({
    post: one(postsTable, {
        fields: [postMediaTable.postId],
        references: [postsTable.id],
    }),
    media: one(mediaTable, {
        fields: [postMediaTable.mediaId],
        references: [mediaTable.id],
    }),
}));

export const mediaRelations = relations(mediaTable, ({ one, many }) => ({
    postMedia: one(postMediaTable, {
        fields: [mediaTable.id],
        references: [postMediaTable.mediaId],
    }),
    tags: many(mediaTagsTable),
}));

export const authorRelations = relations(authorTable, ({ many }) => ({
    posts: many(postsTable),
}));

export const tagsRelations = relations(tagsTable, ({ many }) => ({
    posts: many(postTagsTable),
    media: many(mediaTagsTable),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
    posts: many(postCategoriesTable),
}));

export const postTagsRelations = relations(postTagsTable, ({ one }) => ({
    post: one(postsTable, {
        fields: [postTagsTable.postId],
        references: [postsTable.id],
    }),
    tag: one(tagsTable, {
        fields: [postTagsTable.tagId],
        references: [tagsTable.id],
    }),
}));

export const postCategoriesRelations = relations(postCategoriesTable, ({ one }) => ({
    post: one(postsTable, {
        fields: [postCategoriesTable.postId],
        references: [postsTable.id],
    }),
    category: one(categoriesTable, {
        fields: [postCategoriesTable.categoryId],
        references: [categoriesTable.id],
    }),
}));