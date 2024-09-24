import { db } from "@/db";
import { usersTable, rolesTable, permissionsTable, teamsTable, teamMembersTable, teamMemberRolesTable, userRolesTable, projectsTable, rolePermissionsTable, teamProjectsTable } from "../schema";
import { faker } from "@faker-js/faker";
import { roles, permissions } from "./initalSeed";



export async function seed() {
    // Seed Users
    const users = Array.from({ length: 10 }, (_, i) => ({
        id: i.toString(),
        name: faker.person.fullName(),
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${faker.word.noun()}`,
        username: faker.internet.userName(),
        password: "12345678",
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }));

    users.push({
        id: "11",
        name: "Admin",
        avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Admin",
        username: "admin",
        password: "12345678",
        email: "admin@gmail.com",
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    })


    // Seed Teams
    const teams = Array.from({ length: 3 }, (_, i) => ({
        id: i.toString(),
        name: faker.company.name(),
        avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${faker.word.noun()}`,
        description: faker.company.catchPhrase(),
        ownerId: faker.helpers.arrayElement(users).id,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }));

    // Seed Projects
    const projects = Array.from({ length: 5 }, (_, i) => ({
        id: i.toString(),
        name: faker.word.noun(),
        avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${faker.string.nanoid(10)}&backgroundType=gradientLinear&backgroundColor=${faker.color.rgb().slice(1)}&size=${faker.number.int({ min: 100, max: 500 })}&shapeColor=${faker.color.rgb().slice(1)}`,
        // avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${faker.word.noun()}`,
        description: faker.lorem.sentence(),
        ownerId: faker.helpers.arrayElement(users).id,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }));



    // Seed Team Members
    const teamMembers = teams.flatMap((team, i) => {
        console.log(team, i);
        return users.map((user, j) => ({
            id: `${i}${j} `,
            teamId: team.id,
            userId: user.id,
            disabled: faker.datatype.boolean(),
            joinedAt: faker.date.past(),
            updatedAt: faker.date.recent(),
        }));
    });

    // Seed Team Projects
    const teamProjects = teams.flatMap(team =>
        projects.map(project => ({
            teamId: team.id,
            projectId: project.id,
        }))
    );

    // Seed Team Member Roles
    const teamMemberRoles = teamMembers.flatMap(member => {
        // Randomly select 1 or 2 roles for each team member
        const selectedRoles = faker.helpers.arrayElements(roles, faker.number.int({ min: 1, max: 2 }));
        return selectedRoles.map(role => ({
            teamMemberId: member.id,
            roleId: role.id,
            assignedAt: faker.date.recent(),
        }));
    });

    // Seed User Roles (global roles)
    const userRoles = users.flatMap(user =>
        faker.helpers.arrayElements(roles, faker.number.int({ min: 1, max: 2 })).map(role => ({
            userId: user.id,
            roleId: role.id,
            assignedAt: faker.date.recent(),
        }))
    );

    // Insert data
    await db.insert(usersTable).values(users);
    await db.insert(teamsTable).values(teams);
    await db.insert(projectsTable).values(projects);
    await db.insert(teamMembersTable).values(teamMembers);
    await db.insert(teamProjectsTable).values(teamProjects);
    await db.insert(teamMemberRolesTable).values(teamMemberRoles);
    await db.insert(userRolesTable).values(userRoles);

    console.log('Seed data inserted successfully');
}