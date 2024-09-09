/**
 * TODO:
 * - add user to team with role
 * 
 *  */

import db from "@/db";
import { channelsTable, permissionsTable, rolePermissionsTable, rolesTable, teamChannelsTable, teamMemberRolesTable, teamMembersTable, teamsTable, userRolesTable, usersTable } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { validateRequest } from "./lucia-auth";

export const user = async (id: string) => {

    const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
    }
}

export const isAuthenticated = async () => {
    const { session } = await validateRequest()
    return !!session
}

export async function isAuthorized(userId: string, contextId: string): Promise<boolean> {
    return can(userId, "access", contextId)
}
export async function getUserTeams(userId: string) {
    const userTeams = await db
        .select({
            teamId: teamsTable.id,
            teamName: teamsTable.name,
            teamAvatar: teamsTable.avatar,
            teamDescription: teamsTable.description,
            joinedAt: teamMembersTable.joinedAt,
            isDisabled: teamMembersTable.disabled
        })
        .from(teamMembersTable)
        .innerJoin(teamsTable, eq(teamMembersTable.teamId, teamsTable.id))
        .where(eq(teamMembersTable.userId, userId));

    return userTeams;
}
export async function isTeamMember(userId: string, teamId: string): Promise<boolean> {
    const member = await db
        .select()
        .from(teamMembersTable)
        .where(
            and(
                eq(teamMembersTable.userId, userId),
                eq(teamMembersTable.teamId, teamId),
                eq(teamMembersTable.disabled, false)
            )
        )
        .limit(1);

    return member.length > 0;
}
// Get all users in a team
// -------------------------------------------------------------------------------------------------
export async function getTeamMembers(teamId: string) {
    const teamUsers = await db
        .select({
            userId: usersTable.id,
            userName: usersTable.name,
            userEmail: usersTable.email,
            userUsername: usersTable.username,
            joinedAt: teamMembersTable.joinedAt,
            isDisabled: teamMembersTable.disabled
        })
        .from(teamMembersTable)
        .innerJoin(usersTable, eq(teamMembersTable.userId, usersTable.id))
        .where(eq(teamMembersTable.teamId, teamId));

    return teamUsers;
}
// Check if a user has a permission
// -------------------------------------------------------------------------------------------------
export async function can(userId: string, permissionName: string, contextId?: string): Promise<boolean> {
    let query = db
        .select({ id: permissionsTable.id })
        .from(permissionsTable)
        .where(eq(permissionsTable.name, permissionName))
        .limit(1);

    const subquery = db.$with('user_permissions').as(
        db.select({ permissionId: rolePermissionsTable.permissionId })
            .from(rolePermissionsTable)
            .innerJoin(rolesTable, eq(rolePermissionsTable.roleId, rolesTable.id))
            .where(
                or(
                    // Global roles
                    inArray(rolesTable.id,
                        db.select({ roleId: userRolesTable.roleId })
                            .from(userRolesTable)
                            .where(eq(userRolesTable.userId, userId))
                    ),
                    // Team roles (if contextId is provided)
                    contextId ? inArray(rolesTable.id,
                        db.select({ roleId: teamMemberRolesTable.roleId })
                            .from(teamMemberRolesTable)
                            .innerJoin(teamMembersTable, eq(teamMemberRolesTable.teamMemberId, teamMembersTable.id))
                            .where(and(
                                eq(teamMembersTable.userId, userId),
                                eq(teamMembersTable.disabled, false),
                                or(
                                    eq(teamMembersTable.teamId, contextId),
                                    inArray(teamMembersTable.teamId,
                                        db.select({ teamId: teamChannelsTable.teamId })
                                            .from(teamChannelsTable)
                                            .where(eq(teamChannelsTable.channelId, contextId))
                                    )
                                )
                            ))
                    ) : undefined
                )
            )
    );

    query = query.with(subquery);

    const result = await query
        .where(inArray(permissionsTable.id, subquery))
        .execute();

    return result.length > 0;
}

export async function hasPermission(userId: string, permissionName: string, channelId?: string): Promise<boolean> {
    // Check global permissions
    const globalPermission = await db
        .select()
        .from(userRolesTable)
        .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
        .innerJoin(rolePermissionsTable, eq(rolesTable.id, rolePermissionsTable.roleId))
        .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
        .where(and(
            eq(userRolesTable.userId, userId),
            eq(permissionsTable.name, permissionName)
        ))
        .limit(1);

    if (globalPermission.length > 0) {
        return true;
    }

    // If channelId is provided, check team-specific permissions
    if (channelId) {
        const teamPermission = await db
            .select()
            .from(teamMembersTable)
            .innerJoin(teamMemberRolesTable, eq(teamMembersTable.id, teamMemberRolesTable.teamMemberId))
            .innerJoin(rolesTable, eq(teamMemberRolesTable.roleId, rolesTable.id))
            .innerJoin(rolePermissionsTable, eq(rolesTable.id, rolePermissionsTable.roleId))
            .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
            .innerJoin(teamChannelsTable, eq(teamMembersTable.teamId, teamChannelsTable.teamId))
            .where(and(
                eq(teamMembersTable.userId, userId),
                eq(permissionsTable.name, permissionName),
                eq(teamChannelsTable.channelId, channelId),
                eq(teamMembersTable.disabled, false)
            ))
            .limit(1);

        return teamPermission.length > 0;
    }

    return false;
}


// Function to get user's global roles
export async function getUserGlobalRoles(userId: string) {
    const userRoles = await db
        .select({
            roleId: rolesTable.id,
            roleName: rolesTable.name,
            roleDescription: rolesTable.description,
            assignedAt: userRolesTable.assignedAt
        })
        .from(userRolesTable)
        .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
        .where(eq(userRolesTable.userId, userId));

    return userRoles;
}

// Function to get user's roles within a specific team
export async function getUserTeamRoles(userId: string, teamId: string) {
    const teamRoles = await db
        .select({
            roleId: rolesTable.id,
            roleName: rolesTable.name,
            roleDescription: rolesTable.description,
            assignedAt: teamMemberRolesTable.assignedAt,
            teamName: teamsTable.name
        })
        .from(teamMembersTable)
        .innerJoin(teamMemberRolesTable, eq(teamMembersTable.id, teamMemberRolesTable.teamMemberId))
        .innerJoin(rolesTable, eq(teamMemberRolesTable.roleId, rolesTable.id))
        .innerJoin(teamsTable, eq(teamMembersTable.teamId, teamsTable.id))
        .where(
            and(
                eq(teamMembersTable.userId, userId),
                eq(teamMembersTable.teamId, teamId),
                eq(teamMembersTable.disabled, false)
            )
        );

    return teamRoles;
}

export async function getUserGlobalPermissions(userId: string): Promise<string[]> {
    const globalPermissions = await db
        .select({ permissionName: permissionsTable.name })
        .from(userRolesTable)
        .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
        .innerJoin(rolePermissionsTable, eq(rolesTable.id, rolePermissionsTable.roleId))
        .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
        .where(eq(userRolesTable.userId, userId));

    // Process the results
    const globalPermissionSet = new Set(globalPermissions.map(p => p.permissionName));

    return Array.from(globalPermissionSet);
}


export async function getUserPermissionsByTeamId(userId: string, teamId: string): Promise<string[]> {
    const teamPermissions = await db
        .select({ permissionName: permissionsTable.name })
        .from(teamMembersTable)
        .innerJoin(teamMemberRolesTable, eq(teamMembersTable.id, teamMemberRolesTable.teamMemberId))
        .innerJoin(rolesTable, eq(teamMemberRolesTable.roleId, rolesTable.id))
        .innerJoin(rolePermissionsTable, eq(rolesTable.id, rolePermissionsTable.roleId))
        .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
        .where(and(
            eq(teamMembersTable.userId, userId),
            eq(teamMembersTable.teamId, teamId),
            eq(teamMembersTable.disabled, false)
        ));

    const permissionSet = new Set(teamPermissions.map(p => p.permissionName));
    return Array.from(permissionSet);
}

export async function getUserPermissionsByChannelId(userId: string, channelId: string): Promise<string[]> {
    const channelPermissions = await db
        .select({ permissionName: permissionsTable.name })
        .from(teamMembersTable)
        .innerJoin(teamMemberRolesTable, eq(teamMembersTable.id, teamMemberRolesTable.teamMemberId))
        .innerJoin(rolesTable, eq(teamMemberRolesTable.roleId, rolesTable.id))
        .innerJoin(rolePermissionsTable, eq(rolesTable.id, rolePermissionsTable.roleId))
        .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
        .innerJoin(teamChannelsTable, eq(teamMembersTable.teamId, teamChannelsTable.teamId))
        .where(and(
            eq(teamMembersTable.userId, userId),
            eq(teamChannelsTable.channelId, channelId),
            eq(teamMembersTable.disabled, false)
        ));

    const permissionSet = new Set(channelPermissions.map(p => p.permissionName));
    return Array.from(permissionSet);
}
