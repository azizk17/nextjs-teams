import { relations } from 'drizzle-orm';
import { permissionsTable, rolePermissionsTable, rolesTable, userRolesTable, usersTable } from './userSchema';
import { teamMemberRolesTable, teamMembersTable, teamsTable } from './teamSchema';
import { projectsTable, teamProjectsTable } from './projectSchema';



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








// export type UserWithRelations = User & { roles?: Role[] }




