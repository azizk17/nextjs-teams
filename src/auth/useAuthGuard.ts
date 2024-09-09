import { redirect } from "next/navigation"
import { validateRequest } from "./lucia-auth"
import { can, isAuthorized } from "."


/**
 * useAuthGuard is a utility function for handling authentication and authorization in Next.js applications.
 * It checks if the user is authenticated and has the required permissions to access a resource.
 * 
 */

export async function useAuthGuard(permission: string, contextId?: string) {
    const { user, session } = await validateRequest()

    if (!session) {
        redirect('/signin')
    }

    const canAccess = await can(user.id, permission, contextId)

    if (!canAccess) {
        throw new Error("Unauthorized")
        // Or you could redirect to an error page:
        // redirect('/unauthorized')
    }

    return { user, isAuthenticated: !!session }
}