import { TeamMemberRole, Team, TeamMember, User, Project } from "@/db/schema";
import { UserDto } from "./UserDto";
import { Dto } from "./dto";
// export class TeamMemberRoleDto extends Dto<TeamMemberRole, Record<string, any>> {
//     from(data: TeamMemberRole): Record<string, any> {
//         return {
//             id: data.roleId,
//             name: data.role.name,
//             // description: data.role.description,
//             assignedAt: data.assignedAt,
//         }
//     }
// }

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
export class TeamMemberDto extends Dto<TeamMember & { user: User }> {
    static from(data: TeamMember & { user: User }): Record<string, any> {
        return {
            yoooo: "yoooo" + data.userId,
            id: data.userId,
            disabled: data.disabled,
            joinedAt: data.joinedAt,
            updatedAt: data.updatedAt,
            avatar: data.user.avatar,
            username: data.user.username,
            email: data.user.email,
            // roles: TeamMemberRoleDto.fromMany(data.roles),
            // ...(data.roles && { roles: RoleDto.fromMany(data.roles) }),
        }
    }
}