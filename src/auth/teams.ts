import { db } from "@/db";
import { teamsTable, teamMembersTable, teamChannelsTable, usersTable, channelsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";


// Get team by id
export async function getTeamById(teamId: string) {
    const team = await db.query.teamsTable.findFirst({
        where: eq(teamsTable.id, teamId),
        with: {
            owner: true,
            members: {
                with: {
                    user: true,
                },
            },
            channels: {
                with: {
                    channel: true,
                },
            },
        },
    });
    return team;
}

// Get team members by team id
export async function getTeamMembers(teamId: string) {
    const members = await db.query.teamMembersTable.findMany({
        where: eq(teamMembersTable.teamId, teamId),
        with: {
            user: true,
        },
    });
    return members;
}

// Get teams by user id
export async function getUserTeams(userId: string) {
    const teams = await db.query.teamMembersTable.findMany({
        where: eq(teamMembersTable.userId, userId),
        with: {
            team: true,
        },
    });
    return teams.map(tm => tm.team);
}

// Create new team
export async function createTeam(name: string, description: string, ownerId: string) {
    const newTeam = await db.transaction(async (tx) => {
        const [team] = await tx.insert(teamsTable).values({
            name,
            description,
            avatar: ``,
            ownerId,
        }).returning();

        await tx.insert(teamMembersTable).values({
            teamId: team.id,
            userId: ownerId,
        });

        return team;
    });
    return newTeam;
}

// Delete a team
export async function deleteTeam(teamId: string, userId: string) {
    const team = await getTeamById(teamId);
    if (!team || team.ownerId !== userId) {
        throw new Error("Unauthorized or team not found");
    }

    await db.transaction(async (tx) => {
        await tx.delete(teamChannelsTable).where(eq(teamChannelsTable.teamId, teamId));
        await tx.delete(teamMembersTable).where(eq(teamMembersTable.teamId, teamId));
        await tx.delete(teamsTable).where(eq(teamsTable.id, teamId));
    });
}

// Add member to a team
export async function addTeamMember(teamId: string, userId: string, addedByUserId: string) {
    const team = await getTeamById(teamId);
    if (!team || team.ownerId !== addedByUserId) {
        throw new Error("Unauthorized or team not found");
    }

    await db.insert(teamMembersTable).values({
        teamId,
        userId,
    });
}

// Remove a member from the team
export async function removeTeamMember(teamId: string, userId: string, removedByUserId: string) {
    const team = await getTeamById(teamId);
    if (!team || (team.ownerId !== removedByUserId && userId !== removedByUserId)) {
        throw new Error("Unauthorized or team not found");
    }

    await db.delete(teamMembersTable)
        .where(and(
            eq(teamMembersTable.teamId, teamId),
            eq(teamMembersTable.userId, userId)
        ));
}

// Add project (channel) to a team
export async function addProjectToTeam(teamId: string, channelId: string, addedByUserId: string) {
    const team = await getTeamById(teamId);
    if (!team || team.ownerId !== addedByUserId) {
        throw new Error("Unauthorized or team not found");
    }

    await db.insert(teamChannelsTable).values({
        teamId,
        channelId,
    });
}

// Remove project (channel) from team
export async function removeProjectFromTeam(teamId: string, channelId: string, removedByUserId: string) {
    const team = await getTeamById(teamId);
    if (!team || team.ownerId !== removedByUserId) {
        throw new Error("Unauthorized or team not found");
    }

    await db.delete(teamChannelsTable)
        .where(and(
            eq(teamChannelsTable.teamId, teamId),
            eq(teamChannelsTable.channelId, channelId)
        ));
}