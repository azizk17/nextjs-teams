

// import { User, Team, Project, TeamMember, Role, TeamMemberRole } from "@/db/schema";


// type UserWithRelations = User & { roles?: Role[] }

// export class UserDto {
//     static from(data: UserWithRelations) {
//         return {
//             id: data.id,
//             name: data.name,
//             avatar: data.avatar,
//             username: data.username,
//             email: data.email,
//             ...(data.roles && { roles: data.roles }),
//         }
//     }

//     static fromMany(data: UserWithRelations[]) {
//         return data.map(item => this.from(item));
//     }
// }

// export class RoleDto {
//     static from(data: Role) {
//         return {
//             // id: data.id,
//             name: data.name,
//             description: data.description,
//         }
//     }

//     static fromMany(data: Role[]) {
//         return data.map(item => this.from(item));
//     }
// }


// export class ProjectDto {
//     static from(data: Project) {
//         return {
//             id: data.id,
//             name: data.name,
//             description: data.description,
//             ownerId: data.ownerId,
//             ...(data.owner && { owner: UserDto.from(data.owner) }),
//             teamId: data.teamId,
//             ...(data.team && { team: TeamDto.from(data.team) }),
//         }
//     }

//     static fromMany(data: Project[]) {
//         return data.map(item => this.from(item));
//     }
// }