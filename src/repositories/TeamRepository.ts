// - get team by id
// - create team
// - update team
// - delete team
// - add project to team
// - remove project from team
// - get all teams by project id
// - get all teams by user id
// - add member to team
// - remove member from team
// - get all members by team id
// - get all members by project id

import { eq, and, inArray, desc } from 'drizzle-orm';
import { db } from '@/db';
import { TeamDto } from '@/dto/TeamDto';
import { teamsTable, teamProjectsTable, teamMembersTable, usersTable, projectsTable } from '../db/schema';


export class TeamRepository {
    // Get team by id
    async getTeamById(id: string) {
        const res = await db.query.teamsTable.findFirst({
            where: eq(teamsTable.id, id),
            with: {
                owner: true,
                projects: { with: { project: true } },
                members: { with: { user: true, roles: { with: { role: true } } } },
            },
        });
        return res ? TeamDto.from(res) : null;
    }

    // Create team
    async createTeam(data: { name: string; avatar?: string; description?: string; ownerId: string }) {
        return db.insert(teamsTable).values(data).returning();
    }

    // Update team
    async updateTeam(id: string, data: Partial<typeof teamsTable.$inferInsert>) {
        return db.update(teamsTable).set(data).where(eq(teamsTable.id, id)).returning();
    }

    // Delete team
    async deleteTeam(id: string) {
        return db.delete(teamsTable).where(eq(teamsTable.id, id)).returning();
    }

    // Add project to team
    async addProjectToTeam(teamId: string, projectId: string) {
        return db.insert(teamProjectsTable).values({ teamId, projectId }).returning();
    }

    // Remove project from team
    async removeProjectFromTeam(teamId: string, projectId: string) {
        return db.delete(teamProjectsTable)
            .where(and(eq(teamProjectsTable.teamId, teamId), eq(teamProjectsTable.projectId, projectId)))
            .returning();
    }

    // Get all teams by project id
    async getTeamsByProjectId(projectId: string) {
        return db.query.teamProjectsTable.findMany({
            where: eq(teamProjectsTable.projectId, projectId),
            with: { team: true },
        });
    }

    // Get all teams by user id
    async getTeamsByUserId(userId: string) {
        return db.select({
            id: teamsTable.id,
            name: teamsTable.name,
            avatar: teamsTable.avatar,
            description: teamsTable.description,
            joinedAt: teamMembersTable.joinedAt,
        })
            .from(teamMembersTable)
            .innerJoin(teamsTable, eq(teamMembersTable.teamId, teamsTable.id))
            .where(eq(teamMembersTable.userId, userId))
            .orderBy(desc(teamMembersTable.joinedAt));

    }

    // Add member to team
    async addMemberToTeam(teamId: string, userId: string) {
        return db.insert(teamMembersTable).values({ teamId, userId }).returning();
    }

    // Remove member from team
    async removeMemberFromTeam(teamId: string, userId: string) {
        return db.delete(teamMembersTable)
            .where(and(eq(teamMembersTable.teamId, teamId), eq(teamMembersTable.userId, userId)))
            .returning();
    }

    // Get all members by team id
    async getMembersByTeamId(teamId: string) {
        return db.query.teamMembersTable.findMany({
            where: eq(teamMembersTable.teamId, teamId),
            with: { user: true, roles: { with: { role: true } } },
        });
    }

    // Get all members by project id
    async getMembersByProjectId(projectId: string) {
        const teams = await this.getTeamsByProjectId(projectId);
        const teamIds = teams.map(t => t.teamId);
        return db.query.teamMembersTable.findMany({
            where: inArray(teamMembersTable.teamId, teamIds),
            with: { user: true, roles: { with: { role: true } } },
        });
    }
}
