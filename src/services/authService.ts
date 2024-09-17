import { UnauthenticatedError } from "@/lib/errors"
import { validateRequest } from "./auth/lucia-auth"
import { User } from "lucia"

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
    user?: User;
    error?: { status: number; message: string, redirect?: string };
    can?: (permission: string) => boolean;
};

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

    if (!session) {
        return { authorized: false, error: { status: 401, message: "User is not authenticated", redirect: "/errors/401" } };
    }

    const can = (permission: string) => {
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    }
    if (permission) {
        const hasUserPermission = can(permission);
        if (!hasUserPermission) {
            return {
                authorized: false,
                user,
                error: { status: 403, message: `You are not authorized to ${permission.replace(':', ' ')}`, redirect: "/errors/403" }
            };
        }
    }

    return { authorized: true, user, can };
}


