import { eq, and } from 'drizzle-orm';
import db from '@/db';
import { teamsTable, teamMembersTable, teamProjectsTable, usersTable, projectsTable } from '@/db/schema';
import { NotFoundError, ConflictError } from '@/utils/errors';

export async function getTeamById(id: string) {
    const [team] = await db.select().from(teamsTable).where(eq(teamsTable.id, id));
    if (!team) throw new NotFoundError('Team not found');
    return team;
}

export async function createTeam(data: { name: string; avatar?: string; description?: string; ownerId: string }) {
    const [team] = await db.insert(teamsTable).values(data).returning();
    return team;
}

export async function updateTeam(id: string, data: Partial<{ name: string; avatar?: string; description?: string }>) {
    const [updatedTeam] = await db.update(teamsTable).set(data).where(eq(teamsTable.id, id)).returning();
    if (!updatedTeam) throw new NotFoundError('Team not found');
    return updatedTeam;
}

export async function deleteTeam(id: string) {
    const [deletedTeam] = await db.delete(teamsTable).where(eq(teamsTable.id, id)).returning();
    if (!deletedTeam) throw new NotFoundError('Team not found');
    return deletedTeam;
}

export async function addProjectToTeam(teamId: string, projectId: string) {
    try {
        const [teamProject] = await db.insert(teamProjectsTable)
            .values({ teamId, projectId })
            .returning();
        return teamProject;
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === '23505') {
            throw new ConflictError('Project already added to team');
        }
        throw error;
    }
}

export async function removeProjectFromTeam(teamId: string, projectId: string) {
    const [removedProject] = await db.delete(teamProjectsTable)
        .where(and(eq(teamProjectsTable.teamId, teamId), eq(teamProjectsTable.projectId, projectId)))
        .returning();
    if (!removedProject) throw new NotFoundError('Project not found in team');
    return removedProject;
}

export async function getTeamsByProjectId(projectId: string) {
    return db.select({
        id: teamsTable.id,
        name: teamsTable.name,
        avatar: teamsTable.avatar,
    }).from(teamProjectsTable)
        .innerJoin(teamsTable, eq(teamProjectsTable.teamId, teamsTable.id))
        .where(eq(teamProjectsTable.projectId, projectId));
}

export async function getTeamsByUserId(userId: string) {
    const teams = await db.select({
        id: teamsTable.id,
        name: teamsTable.name,
        avatar: teamsTable.avatar,
        description: teamsTable.description,
    }).from(teamMembersTable)
        .innerJoin(teamsTable, eq(teamMembersTable.teamId, teamsTable.id))
        .where(eq(teamMembersTable.userId, userId));
    return teams;
}

export async function addMemberToTeam(teamId: string, userId: string) {
    try {
        const [teamMember] = await db.insert(teamMembersTable)
            .values({ teamId, userId })
            .returning();
        return teamMember;
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === '23505') {
            throw new ConflictError('User is already a member of this team');
        }
        throw error;
    }
}

export async function removeMemberFromTeam(teamId: string, userId: string) {
    const [removedMember] = await db.delete(teamMembersTable)
        .where(and(eq(teamMembersTable.teamId, teamId), eq(teamMembersTable.userId, userId)))
        .returning();
    if (!removedMember) throw new NotFoundError('Member not found in team');
    return removedMember;
}

export async function getMembersByTeamId(teamId: string) {
    return db.select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        avatar: usersTable.avatar,
    }).from(teamMembersTable)
        .innerJoin(usersTable, eq(teamMembersTable.userId, usersTable.id))
        .where(eq(teamMembersTable.teamId, teamId));
}

export async function getMembersByProjectId(projectId: string) {
    return db.select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        avatar: usersTable.avatar,
    }).from(teamProjectsTable)
        .innerJoin(teamMembersTable, eq(teamProjectsTable.teamId, teamMembersTable.teamId))
        .innerJoin(usersTable, eq(teamMembersTable.userId, usersTable.id))
        .where(eq(teamProjectsTable.projectId, projectId));
}
