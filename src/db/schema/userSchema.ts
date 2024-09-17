
import { pgTable, text, timestamp, primaryKey, integer, boolean, unique, json, serial, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { nanoId } from '@/lib/utils';
// Users table
export const usersTable = pgTable('users', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name'),
    avatar: text('avatar'),
    username: text('username').notNull().unique().$defaultFn(() => nanoId(8)),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    email_verified: boolean('email_verified').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export const sessionsTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => usersTable.id),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull()
});

export const tokenTypes = pgEnum('type', ['email_verification', 'password_reset', 'phone_verification', "access_token", "refresh_token"]);
export const tokensTable = pgTable('tokens', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(32)),
    userId: text('user_id').notNull().references(() => usersTable.id),
    type: tokenTypes("type"),
    token: text('token').notNull(),
    verified: boolean('verified').default(false),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    // If the token is invalidated
    isInvalid: boolean('is_invalid').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),

});


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



// Types
// -------------------------------------------------------------------------------------------------
export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
export const CreateUserSchema = createInsertSchema(usersTable);

export type Role = typeof rolesTable.$inferSelect;
export type InsertRole = typeof rolesTable.$inferInsert;

export type Permission = typeof permissionsTable.$inferSelect;
export type InsertPermission = typeof permissionsTable.$inferInsert;

export type Token = typeof tokensTable.$inferSelect;
export type InsertToken = typeof tokensTable.$inferInsert;

