import { pgTable, text, timestamp, uuid, primaryKey, integer, boolean, foreignKey, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';



// Users table
export const usersTable = pgTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export const sessionsTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => usersTable.id),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull()
});
// Channels table
export const channelsTable = pgTable('channels', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    ownerId: text('owner_id').notNull().references(() => usersTable.id),
});
// Teams table
export const teamsTable = pgTable('teams', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    avatar: text('avatar'),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    ownerId: text('owner_id').notNull().references(() => usersTable.id),
});



// Team Channels table
export const teamChannelsTable = pgTable('team_channels', {
    teamId: text('team_id').notNull().references(() => teamsTable.id),
    channelId: text('channel_id').notNull().references(() => channelsTable.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.teamId, t.channelId] }),
}));

// Team Members table
export const teamMembersTable = pgTable('team_members', {
    id: text('id').primaryKey(),
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
    roleId: text('role_id').notNull().references(() => rolesTable.id),
    assignedAt: timestamp('assigned_at').defaultNow(),
}, (t) => ({
    pk: primaryKey({ columns: [t.teamMemberId, t.roleId] }),
    unique: unique().on(t.teamMemberId, t.roleId),
}));


// Roles & Permissions
// -------------------------------------------------------------------------------------------------

// Roles table
export const rolesTable = pgTable('roles', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
});
// Permissions table
export const permissionsTable = pgTable('permissions', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
});
// Junction table for roles and permissions (many-to-many)
export const rolePermissionsTable = pgTable('role_permissions', {
    roleId: text('role_id').notNull().references(() => rolesTable.id),
    permissionId: text('permission_id').notNull().references(() => permissionsTable.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
}));

// User Roles table (for global roles)
export const userRolesTable = pgTable('user_roles', {
    userId: text('user_id').notNull().references(() => usersTable.id),
    roleId: text('role_id').notNull().references(() => rolesTable.id),
    assignedAt: timestamp('assigned_at').defaultNow(),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
}));

// Relations
// -------------------------------------------------------------------------------------------------

export const usersRelations = relations(usersTable, ({ many }) => ({
    roles: many(userRolesTable),
    memberOf: many(teamMembersTable),
    channels: many(channelsTable),
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

export const channelsRelations = relations(channelsTable, ({ many, one }) => ({
    teams: many(teamChannelsTable),
    owner: one(usersTable, {
        fields: [channelsTable.ownerId],
        references: [usersTable.id],
    }),
}));

export const teamsRelations = relations(teamsTable, ({ many, one }) => ({
    channels: many(teamChannelsTable),
    members: many(teamMembersTable),
    owner: one(usersTable, {
        fields: [teamsTable.ownerId],
        references: [usersTable.id],
    }),
}));
export const teamChannelsRelations = relations(teamChannelsTable, ({ one }) => ({
    team: one(teamsTable, {
        fields: [teamChannelsTable.teamId],
        references: [teamsTable.id],
    }),
    channel: one(channelsTable, {
        fields: [teamChannelsTable.channelId],
        references: [channelsTable.id],
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





