import { db } from "@/db";
import { usersTable, channelsTable, teamMembersTable, teamChannelsTable, teamsTable } from "@/db/schema";
import { eq, or, and } from "drizzle-orm";

export async function getUserProjects(userId: string) {
    const userChannels = await db
        .select({
            id: channelsTable.id,
            name: channelsTable.name,
            avatar: channelsTable.avatar,
            description: channelsTable.description,
            createdAt: channelsTable.createdAt,
            updatedAt: channelsTable.updatedAt,
            ownerId: channelsTable.ownerId,
            teamId: teamsTable.id,
            teamName: teamsTable.name,
        })
        .from(channelsTable)
        .leftJoin(teamChannelsTable, eq(teamChannelsTable.channelId, channelsTable.id))
        .leftJoin(teamsTable, eq(teamsTable.id, teamChannelsTable.teamId))
        .leftJoin(teamMembersTable, eq(teamMembersTable.teamId, teamsTable.id))
        .where(
            or(
                eq(channelsTable.ownerId, userId),
                and(
                    eq(teamMembersTable.userId, userId),
                    eq(teamMembersTable.disabled, false)
                )
            )
        );

    return userChannels;
}