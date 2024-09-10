import { Role, User } from "@/db/schema";
import { TeamDto } from "./TeamDto";
import { Dto } from "./dto";
export class UserDto extends Dto<User> {
    static from(data: User): Record<string, any> {
        return {
            id: data.id,
            username: data.username,
            email: data.email,
            avatar: data.avatar,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            // ...(data.teams && { teams: TeamDto.fromMany(data.teams) }),
            // ...(data.projects && { projects: ProjectDto.fromMany(data.projects) }),
        }
    }
    static fromFlat(data: User): Record<string, any> {
        return {
            id: data.id,
            username: data.username,
            email: data.email,
            avatar: data.avatar,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }
}

// roles 
export class RoleDto extends Dto<Role> {
    static from(data: Role): Record<string, any> {
        return {
            id: data.id,
            name: data.name,
        }
    }
}

