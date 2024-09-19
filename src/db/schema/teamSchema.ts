import { pgTable, text, timestamp, primaryKey, integer, boolean, unique, json, serial, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { nanoId } from '@/lib/utils';
import { rolesTable, usersTable } from './userSchema';

// Teams table
export const teamsTable = pgTable('teams', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    avatar: text('avatar'),
    description: text('description'),
    disabled: boolean('disabled').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    ownerId: text('owner_id').notNull().references(() => usersTable.id),
});

// Team Members table
export const teamMembersTable = pgTable('team_members', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(8)),
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

// Team Invitations table
export const teamInvitationsTable = pgTable('team_invitations', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
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

export type Team = typeof teamsTable.$inferSelect;
export type NewTeam = typeof teamsTable.$inferInsert;
export const teamSchema = createInsertSchema(teamsTable);

export type TeamMember = typeof teamMembersTable.$inferSelect;
export type NewTeamMember = typeof teamMembersTable.$inferInsert;

export type TeamMemberRole = typeof teamMemberRolesTable.$inferSelect;
export type NewTeamMemberRole = typeof teamMemberRolesTable.$inferInsert;

export type TeamInvitation = typeof teamInvitationsTable.$inferSelect;
export type NewTeamInvitation = typeof teamInvitationsTable.$inferInsert;
// Schemas
export const teamInvitationSchema = createInsertSchema(teamInvitationsTable);
export const teamMemberSchema = createInsertSchema(teamMembersTable);
export const teamMemberRoleSchema = createInsertSchema(teamMemberRolesTable);

