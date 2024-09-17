import { ForbiddenError, UnauthenticatedError } from "@/lib/errors"
import { validateRequest } from "./auth/lucia-auth"
import { User } from "lucia"
import { teamMembersTable, teamsTable } from "@/db/schema"
import db from "@/db"

import { isTeamMemberOrOwner } from "./teamService"

// @deprecated
export async function auth() {
    const { user, session } = await validateRequest()
    return {
        user,
        isAuthenticated: !!session
    }
}

// @deprecated
export async function isAuthenticated() {
    const { isAuthenticated } = await auth()
    return isAuthenticated
}

// @deprecated
export async function user() {
    const { user } = await auth()
    return user
}

type AuthGuardResult = {
    authorized: boolean;
    user: User;
    // @deprecated
    // error?: { status: number; message: string, redirect?: string };
    can?: (permission: string) => boolean;
};


const can = (user: User, permission: string) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
}
/**
 * Authorize a user to access a resource
 * 
 * @param permission - The permission to check for (optional)
 * @returns {AuthGuardResult} - The result of the authorization check
 * 
 * Usage:
 * const result = await authGuard('user:read');
 * 
 * The 'authorized' property in the result is crucial:
 * - If true, the user is authenticated and has the required permission (if specified).
 * - If false, the user is either not authenticated or lacks the necessary permission.
 * 
 * Example:
 * if (result.authorized) {
 *   // Proceed with the protected operation
 * } else {
 *   // Handle unauthorized access (e.g., redirect or show error message)
 *   console.error(result.error);
 * }
 */
export async function authGuard(permission?: string): Promise<AuthGuardResult> {
    const { user, session } = await validateRequest()
    console.log("user", user)
    if (!session) {
        throw new UnauthenticatedError();
        // return { authorized: false, error: { status: 401, message: "User is not authenticated", redirect: "/errors/401" } };
    }


    const can = (permission: string | string[]) => {
        if (!user || !user.permissions) return false;
        const permissions = Array.isArray(permission) ? permission : [permission];
        return permissions.some(p => user.permissions.includes(p));
    };
    if (permission && permission.trim()) {
        const hasUserPermission = can(permission);
        if (!hasUserPermission) {
            throw new ForbiddenError();
        }
    }

    return { authorized: true, user, can };
}


// team auth guard
export async function teamAuthGuard(teamId: string, permission: string): Promise<AuthGuardResult> {
    const { user, session } = await validateRequest()
    if (!session) {
        return { authorized: false, error: { status: 401, message: "User is not authenticated", redirect: "/errors/401" } };
    }

    const team = await db.select().from(teamsTable).where(eq(teamsTable.id, teamId))

    if (!team) {
        return { authorized: false, error: { status: 404, message: "Team not found", redirect: "/errors/404" } };
    }

    const teamMember = await db.select().from(teamMembersTable).where(eq(teamMembersTable.teamId, teamId))

    if (!teamMember) {
        return { authorized: false, error: { status: 404, message: "Team member not found", redirect: "/errors/404" } };
    }

    const hasUserPermission = can(user, permission);
    if (!hasUserPermission) {
        return {
            authorized: false,
            error: { status: 403, message: `You are not authorized to ${permission.replace(':', ' ')}`, redirect: "/errors/403" }
        };
    }

    return { authorized: true, user, can: (permission: string) => can(user, permission) };
}
// Team auth guard
export async function teamAuthGuard1(teamId: string, permission?: string): Promise<AuthGuardResult> {
    const authResult = await authGuard(permission);

    if (!authResult.authorized) {
        return authResult;
    }

    const isTeamMember = await isTeamMemberOrOwner(teamId, authResult.user.id);
    if (!isTeamMember) {
        throw new ForbiddenError();
    }

    return {
        ...authResult,
        can: (teamPermission: string) => {
            if (!authResult.can) return false;
            return authResult.can(`team:${teamId}:${teamPermission}`);
        }
    };
}

