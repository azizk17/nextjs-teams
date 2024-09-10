import { TeamRepository } from '@/repositories/TeamRepository';
import { NotFoundError, ConflictError } from '@/utils/errors';

export class TeamService {
    private teamRepository: TeamRepository;

    constructor() {
        this.teamRepository = new TeamRepository();
    }

    async getTeamById(id: string) {
        const team = await this.teamRepository.getTeamById(id);
        if (!team) throw new NotFoundError('Team not found');
        return team;
    }

    async createTeam(data: { name: string; avatar?: string; description?: string; ownerId: string }) {
        const [team] = await this.teamRepository.createTeam(data);
        return team;
    }

    async updateTeam(id: string, data: Partial<{ name: string; avatar?: string; description?: string }>) {
        const [updatedTeam] = await this.teamRepository.updateTeam(id, data);
        if (!updatedTeam) throw new NotFoundError('Team not found');
        return updatedTeam;
    }

    async deleteTeam(id: string) {
        const [deletedTeam] = await this.teamRepository.deleteTeam(id);
        if (!deletedTeam) throw new NotFoundError('Team not found');
        return deletedTeam;
    }

    async addProjectToTeam(teamId: string, projectId: string) {
        try {
            const [teamProject] = await this.teamRepository.addProjectToTeam(teamId, projectId);
            return teamProject;
        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new ConflictError('Project already added to team');
            }
            throw error;
        }
    }

    async removeProjectFromTeam(teamId: string, projectId: string) {
        const [removedProject] = await this.teamRepository.removeProjectFromTeam(teamId, projectId);
        if (!removedProject) throw new NotFoundError('Project not found in team');
        return removedProject;
    }

    async getTeamsByProjectId(projectId: string) {
        return this.teamRepository.getTeamsByProjectId(projectId);
    }

    async getTeamsByUserId(userId: string) {
        return this.teamRepository.getTeamsByUserId(userId);
    }

    async addMemberToTeam(teamId: string, userId: string) {
        try {
            const [teamMember] = await this.teamRepository.addMemberToTeam(teamId, userId);
            return teamMember;
        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new ConflictError('User is already a member of this team');
            }
            throw error;
        }
    }

    async removeMemberFromTeam(teamId: string, userId: string) {
        const [removedMember] = await this.teamRepository.removeMemberFromTeam(teamId, userId);
        if (!removedMember) throw new NotFoundError('Member not found in team');
        return removedMember;
    }

    async getMembersByTeamId(teamId: string) {
        return this.teamRepository.getMembersByTeamId(teamId);
    }

    async getMembersByProjectId(projectId: string) {
        return this.teamRepository.getMembersByProjectId(projectId);
    }
}