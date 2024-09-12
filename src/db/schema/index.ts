import { pgTable, text, timestamp, uuid, primaryKey, integer, boolean, foreignKey, unique, json, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { customAlphabet } from 'nanoid'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const myNanoId = (length: number): string => {
    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', length)
    return nanoid()
}
// Projects table
export const projectsTable = pgTable('projects', {
    id: text('id').primaryKey().$defaultFn(() => myNanoId(10)),
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

// Users table
export const usersTable = pgTable('users', {
    id: text('id').primaryKey().$defaultFn(() => myNanoId(10)),
    name: text('name').notNull(),
    avatar: text('avatar'),
    username: text('username').notNull().unique().$defaultFn(() => myNanoId(8)),
    password: text('password').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export const sessionsTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => usersTable.id),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull()
});

// Teams table
export const teamsTable = pgTable('teams', {
    id: text('id').primaryKey().$defaultFn(() => myNanoId(10)),
    name: text('name').notNull(),
    avatar: text('avatar'),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    ownerId: text('owner_id').notNull().references(() => usersTable.id),
});



// Team Members table
export const teamMembersTable = pgTable('team_members', {
    id: text('id').primaryKey().$defaultFn(() => myNanoId(8)),
    teamId: text('team_id').notNull().references(() => teamsTable.id),
    userId: text('user_id').notNull().references(() => usersTable.id),
    disabled: boolean('disabled').default(false),
    joinedAt: timestamp('joined_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
    unique: unique().on(t.teamId, t.userId),
}));

// Team Member Roles table
// Each user can have multiple roles in a team
export const teamMemberRolesTable = pgTable('team_member_roles', {
    teamMemberId: text('team_member_id').notNull().references(() => teamMembersTable.id),
    roleId: integer('role_id').notNull().references(() => rolesTable.id),
    assignedAt: timestamp('assigned_at').defaultNow(),
}, (t) => ({
    pk: primaryKey({ columns: [t.teamMemberId, t.roleId] }),
    unique: unique().on(t.teamMemberId, t.roleId),
}));


// Roles & Permissions
// -------------------------------------------------------------------------------------------------

// Roles table
export const rolesTable = pgTable('roles', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
});
// Permissions table
export const permissionsTable = pgTable('permissions', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
});
// Junction table for roles and permissions (many-to-many)
export const rolePermissionsTable = pgTable('role_permissions', {
    roleId: integer('role_id').notNull().references(() => rolesTable.id),
    permissionId: integer('permission_id').notNull().references(() => permissionsTable.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
}));

// User Roles table (for global roles)
export const userRolesTable = pgTable('user_roles', {
    userId: text('user_id').notNull().references(() => usersTable.id),
    roleId: integer('role_id').notNull().references(() => rolesTable.id),
    assignedAt: timestamp('assigned_at').defaultNow(),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
}));

export const teamInvitationsTable = pgTable('team_invitations', {
    id: text('id').primaryKey().$defaultFn(() => myNanoId(10)),
    teamId: text('team_id').notNull().references(() => teamsTable.id),
    inviterId: text('inviter_id').notNull().references(() => usersTable.id),
    inviteeEmail: text('invitee_email').notNull(),
    status: text('status').notNull().default('pending'),
    roleId: integer('role_id').notNull().references(() => rolesTable.id),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

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






// Types
// -------------------------------------------------------------------------------------------------
export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
export const CreateUserSchema = createInsertSchema(usersTable);

export type Role = typeof rolesTable.$inferSelect;
export type InsertRole = typeof rolesTable.$inferInsert;



// export type UserWithRelations = User & { roles?: Role[] }

export type Team = typeof teamsTable.$inferSelect;
export type InsertTeam = typeof teamsTable.$inferInsert;
export const CreateTeamSchema = createInsertSchema(teamsTable);


export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;

export type TeamMember = typeof teamMembersTable.$inferSelect;
export type InsertTeamMember = typeof teamMembersTable.$inferInsert;

export type TeamMemberRole = typeof teamMemberRolesTable.$inferSelect;
export type InsertTeamMemberRole = typeof teamMemberRolesTable.$inferInsert;

export type TeamInvitation = typeof teamInvitationsTable.$inferSelect;
export type InsertTeamInvitation = typeof teamInvitationsTable.$inferInsert;
export const CreateTeamInvitationSchema = createInsertSchema(teamInvitationsTable);
