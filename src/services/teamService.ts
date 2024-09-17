import { eq, and, sql, desc } from 'drizzle-orm';
import db from '@/db';
import { teamsTable, teamMembersTable, teamProjectsTable, usersTable, projectsTable, rolesTable, teamMemberRolesTable, invitationsTable, teamInvitationsTable, InsertTeamInvitation, InsertTeam } from '@/db/schema';
import { NotFoundError, ConflictError } from '@/lib/errors';

export async function getTeam(id: string) {
    const [team] = await db.select().from(teamsTable).where(eq(teamsTable.id, id));
    return team || null;
}

export async function createTeam(data: { name: string; avatar?: string; description?: string; ownerId: string }) {
    const [team] = await db.insert(teamsTable).values(data).returning();
    return team;
}

export async function updateTeam(id: string, data: Partial<InsertTeam>) {
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
        ownerId: teamsTable.ownerId,
        createdAt: teamsTable.createdAt,
        updatedAt: teamsTable.updatedAt,
    }).from(teamsTable)
        .where(eq(teamsTable.ownerId, userId))
        .orderBy(desc(teamsTable.createdAt));
    return teams;
}

export async function addMemberToTeam(teamId: string, userId: string, roleId: string) {
    const newMember = await db.transaction(async (tx) => {
        const [member] = await tx.insert(teamMembersTable).values({
            teamId,
            userId,
            disabled: false,
            joinedAt: new Date(),
        }).returning({ id: teamMembersTable.id });

        await tx.insert(teamMemberRolesTable).values({
            teamMemberId: member.id,
            roleId,
            assignedAt: new Date(),
        });

        return member;
    });

    return newMember;
}

export async function removeMemberFromTeam(teamId: string, userId: string) {
    const [removedMember] = await db.delete(teamMembersTable)
        .where(and(eq(teamMembersTable.teamId, teamId), eq(teamMembersTable.userId, userId)))
        .returning();
    if (!removedMember) throw new NotFoundError('Member not found in team');
    return removedMember;
}

export async function getTeamMembers(teamId: string) {
}
export const getProjectMembersWithRoles1 = async (projectId: string) => {
    return await db
        .select({
            projectId: projectsTable.id,
            projectName: projectsTable.name,
            userId: usersTable.id,
            userName: usersTable.name,
            userEmail: usersTable.email,
            teamId: teamsTable.id,
            teamName: teamsTable.name,
            roleName: rolesTable.name,
        })
        .from(projectsTable)
        .innerJoin(teamProjectsTable, eq(teamProjectsTable.projectId, projectsTable.id))
        .innerJoin(teamsTable, eq(teamsTable.id, teamProjectsTable.teamId))
        .innerJoin(teamMembersTable, eq(teamMembersTable.teamId, teamsTable.id))
        .innerJoin(usersTable, eq(usersTable.id, teamMembersTable.userId))
        .leftJoin(teamMemberRolesTable, eq(teamMemberRolesTable.teamMemberId, teamMembersTable.id))
        .leftJoin(rolesTable, eq(rolesTable.id, teamMemberRolesTable.roleId))
        .where(eq(projectsTable.id, projectId));
};

export const getProjectMembersWithRoles = async (projectId: string) => {
    const rolesSubquery = db
        .select({
            userId: teamMembersTable.userId,
            teamId: teamMembersTable.teamId,
            roles: sql<string>`json_agg(json_build_object('id', ${rolesTable.id}, 'name', ${rolesTable.name}))`.as('roles'),
        })
        .from(teamMembersTable)
        .leftJoin(teamMemberRolesTable, eq(teamMemberRolesTable.teamMemberId, teamMembersTable.id))
        .leftJoin(rolesTable, eq(rolesTable.id, teamMemberRolesTable.roleId))
        .groupBy(teamMembersTable.userId, teamMembersTable.teamId)
        .as('roles_subquery');

    return await db
        .select({
            //   projectId: projectsTable.id,
            projectName: projectsTable.name,
            userId: usersTable.id,
            userName: usersTable.name,
            userEmail: usersTable.email,
            userAvatar: usersTable.avatar,
            //   teamId: teamsTable.id,
            //   teamName: teamsTable.name,
            roles: rolesSubquery.roles,
        })
        .from(projectsTable)
        .innerJoin(teamProjectsTable, eq(teamProjectsTable.projectId, projectsTable.id))
        .innerJoin(teamsTable, eq(teamsTable.id, teamProjectsTable.teamId))
        .innerJoin(teamMembersTable, eq(teamMembersTable.teamId, teamsTable.id))
        .innerJoin(usersTable, eq(usersTable.id, teamMembersTable.userId))
        .innerJoin(rolesSubquery, and(
            eq(rolesSubquery.userId, usersTable.id),
            eq(rolesSubquery.teamId, teamsTable.id)
        ))
        .where(eq(projectsTable.id, projectId));
};

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

export async function createTeamInvitation(data: InsertTeamInvitation) {
    const [invitation] = await db.insert(teamInvitationsTable)
        .values(data)
        .returning();
    return invitation;
}

export async function getTeamInvitations(teamId: string) {
    return db.select().from(invitationsTable).where(eq(invitationsTable.teamId, teamId));
}

export async function getTeamInvitationByToken(token: string) {
    const [invitation] = await db.select().from(invitationsTable).where(eq(invitationsTable.token, token));
    return invitation;
}

export async function updateTeamInvitationStatus(token: string, status: string) {
    const [invitation] = await db.update(invitationsTable).set({ status }).where(eq(invitationsTable.token, token)).returning();

    return invitation;
}

export async function deleteTeamInvitation(token: string) {
    const [invitation] = await db.delete(invitationsTable).where(eq(invitationsTable.token, token)).returning();
    return invitation;
}

export async function getTeamInvitationByEmail(email: string) {
    const [invitation] = await db.select().from(invitationsTable).where(eq(invitationsTable.inviteeEmail, email));

    return invitation;
}