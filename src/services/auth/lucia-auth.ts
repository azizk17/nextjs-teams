import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import db from "@/db";
import { sessionsTable, usersTable } from "@/db/schema";
import { cookies } from "next/headers";
import { cache } from "react";

import type { Session, User } from "lucia";
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
    }
});


export type DatabaseUser = {
    id: string;
    email: string;
    password: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        // DatabaseUserAttributes: Omit<DatabaseUser, "id">;
        DatabaseUserAttributes: Omit<DatabaseUser, "id">;
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
        return result;
    }
);