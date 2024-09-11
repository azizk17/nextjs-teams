import { validateRequest } from "./lucia-auth"
import { enforcer } from "./casbin"
import { membersTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import db from "@/db"
export const user = async () => {
    const { user } = await validateRequest()
    return user
}

export const isAuthenticated = async () => {
    const { session } = await validateRequest()
    return !!session
}

// assign role to user
export const assignRole = async (role: string, userId: string) => {
    await (await enforcer()).addRoleForUser(userId, role)
}
export const removeRole = async (role: string, userId: string) => {
    const { session } = await validateRequest()
    return session
}

export const hasRole = async (role: string, userId: string) => {
    const { session } = await validateRequest()
    return session
}

export const addMemberToGroup = async (userId: string, group: string, role: string) => {
    await (await enforcer()).addGroupingPolicy(`user:${userId}`, `channel:${group}`, `role:${role}`)
}

export const removeMemberFromGroup = async (group: string, userId: string) => {
    const { session } = await validateRequest()
    return session
}

export const isMember = async (userId: string, channelId: string) => {
    const b = await db.select().from(membersTable).where(and(eq(membersTable.userId, userId), eq(membersTable.channelId, channelId)))
    return b
}