import { enforcer } from "./casbin"
import { redirect } from "next/navigation"
import { validateRequest } from "./lucia-auth"
import db from "@/db"
import { membersTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"


/**
 * useAuthGuard is a utility function for handling authentication and authorization in Next.js applications.
 * It checks if the user is authenticated and has the required permissions to access a resource.
 * 
 * @param permission - A string in the format "resource:action" (e.g., "channel:view")
 * @param domain - Optional. The domain for the permission check. If not provided, it's extracted from the resource.
 * @returns An object containing the user and authentication status.
 * @throws Error if the user is not authorized.
 * @redirects to '/signin' if the user is not authenticated.
 * 
 * Example usage:
 * 
 * ```typescript
 * export default async function ProtectedPage() {
 *   const { user, isAuthenticated } = await useAuthGuard('channel:view', 'channel:123');
 *   
 *   // If execution reaches here, the user is authenticated and authorized
 *   return <div>Welcome, {user.email}!</div>;
 * }
 * ```
 */

export const isChannelMember = async (userId: string, channelId: string) => {
    const b = await db.select().from(membersTable).where(and(eq(membersTable.userId, userId), eq(membersTable.channelId, channelId)))
    return b
}

export async function useAuthGuard(permission: string, domain?: string) {
    const { user, session } = await validateRequest()

    if (!session) {
        redirect('/signin')
    }

    const e = await enforcer()
    const [resource, action] = permission.split(':')
    const [model, id] = domain?.split(':') ?? []
    if (model === 'channel') {
        const isMember = await isChannelMember(user.id, id)
        if (!isMember) {
            throw new Error(`You are not a member of this channel ${id}`)
        }
    }

    const canAccess = await e.enforce(`user:${user.id}`, domain, resource, action)

    if (!canAccess) {
        throw new Error("Unauthorized")
        // Or you could redirect to an error page:
        // redirect('/unauthorized')
    }

    return { user, isAuthenticated: !!session }
}
// export async function useAuthGuard(resource: string, action: string, domain?: string) {
//     const { user, session } = await validateRequest()

//     if (!session) {
//         redirect('/signin')
//     }

//     const e = await enforcer()
//     domain = domain ?? resource.split(':')[0]

//     const canAccess = await e.enforce(`user:${user.id}`, domain, resource, action)

//     if (!canAccess) {
//         throw new Error("Unauthorized")
//         // Or you could redirect to an error page:
//         // redirect('/unauthorized')
//     }

//     return { user, isAuthenticated: !!session }
// }