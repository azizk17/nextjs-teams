import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import db from "@/db";
import { Permission, Role, sessionsTable, usersTable } from "@/db/schema";
import { cookies } from "next/headers";
import { cache } from "react";


import type { Session, User } from "lucia";
import { getUserPermissions, getUserRoles } from "../userService";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        // this sets cookies with super long expiration
        // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
        expires: false,
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production"
        }
    },
});


export type DatabaseUser = typeof usersTable.$inferSelect & {
    permissions: Permission[];
    roles: Role[];
};

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        // DatabaseUserAttributes: Omit<DatabaseUser, "id">;
        DatabaseUserAttributes: Omit<DatabaseUser, "id">;
    }
    // Add this to extend the User type
    interface User {
        permissions: string[];
        roles: string[];
    }
}

export const validateRequest = cache(
    async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
        if (!sessionId) {
            return {
                user: null,
                session: null
            };
        }

        const result = await lucia.validateSession(sessionId);

        // roles and permissions are not available in the session
        // so we need to fetch them from the database
        if (result.session && result.user) {
            // Fetch additional user data here
            const permissions = await getUserPermissions(result.user.id);
            const roles = await getUserRoles(result.user.id);

            // Extend the user object with the fetched data
            result.user = {
                ...result.user,
                // Use type assertion to add properties not in the User type
                permissions: permissions.map(p => p.name),
                roles: roles.map(r => r.name)
            } as User & { permissions: string[]; roles: string[] };
        }

        // next.js throws when you attempt to set cookie when rendering page
        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(result.session.id);
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }
        } catch { }
        return result
    }
);