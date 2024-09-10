import { TeamMemberRole, Team, TeamMember, User, Project, Role } from "@/db/schema";
import { RoleDto, UserDto } from "./UserDto";
import { Dto } from "./dto";


type TeamWithRelations = Team & { owner: User, projects: Project[], members: (TeamMember & { user: User })[] }


export class TeamDto extends Dto<TeamWithRelations> {
    static from(data: TeamWithRelations) {
        return {
            id: data.id,
            name: data.name,
            avatar: data.avatar,
            description: data.description,
            ownerId: data.ownerId,
            ...(data.owner && { owner: UserDto.from(data.owner) }),
            // ...(data.projects && { projects: ProjectDto.fromMany(data.projects) }),
            ...(data.members && { members: TeamMemberDto.fromMany(data.members) }),
        }
    }
}
export class TeamMemberDto extends Dto<TeamMember & { user: User, roles: TeamMemberRole[] }> {
    static from(data: TeamMember & { user: User, roles: TeamMemberRole[] }): Record<string, any> {
        return {
            yoooo: "yoooo" + data.userId,
            ...UserDto.from(data.user),
            disabled: data.disabled,
            joinedAt: data.joinedAt,
            ...(data.roles && { roles: TeamMemberRoleDto.fromMany(data.roles) }),
        }
    }
}

export class TeamMemberRoleDto extends Dto<TeamMemberRole & { role: Role }> {
    static from(data: TeamMemberRole & { role: Role }): Record<string, any> {
        return {
            ...RoleDto.from(data.role),
            assignedAt: data.assignedAt,
        }
    }
}