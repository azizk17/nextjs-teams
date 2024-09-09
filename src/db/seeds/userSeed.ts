import { db } from "@/db";
import { usersTable, rolesTable, permissionsTable, channelsTable, rolePermissionsTable, teamsTable, teamMembersTable, teamChannelsTable, teamMemberRolesTable, userRolesTable } from "../schema";
import { faker } from "@faker-js/faker";

export async function seed() {
    // Seed Users
    const users = Array.from({ length: 10 }, (_, i) => ({
        // id: faker.string.nanoid(9),
        id: i.toString(),
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }));

    // Seed Roles
    const roles = [
        { id: '1', name: 'Admin', description: 'Full access' },
        { id: '2', name: 'Moderator', description: 'Can moderate content' },
        { id: '3', name: 'User', description: 'Regular user access' },
    ];

    // Seed Permissions
    const permissions = [
        { id: '1', name: 'create_post', description: 'Can create posts' },
        { id: '2', name: 'delete_post', description: 'Can delete posts' },
        { id: '3', name: 'edit_user', description: 'Can edit user profiles' },
        { id: '4', name: 'create_channel', description: 'Can create channels' },
        { id: '5', name: 'delete_channel', description: 'Can delete channels' },
        { id: '6', name: 'edit_channel', description: 'Can edit channels' },
        { id: '7', name: 'add_member_to_team', description: 'Can add members to teams' },
        { id: '8', name: 'remove_member_from_team', description: 'Can remove members from teams' },
        { id: '9', name: 'create_team', description: 'Can create teams' },
        { id: '10', name: 'delete_team', description: 'Can delete teams' },
        { id: '11', name: 'edit_team', description: 'Can edit teams' },
    ];

    // Seed Teams
    const teams = Array.from({ length: 3 }, (_, i) => ({
        id: i.toString(),
        name: faker.company.name(),
        avatar: faker.image.avatarGitHub(),
        description: faker.company.catchPhrase(),
        ownerId: faker.helpers.arrayElement(users).id,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }));

    // Seed Channels
    const channels = Array.from({ length: 5 }, (_, i) => ({
        id: i.toString(),
        name: faker.word.noun(),
        description: faker.lorem.sentence(),
        ownerId: faker.helpers.arrayElement(users).id,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }));

    // Seed Role Permissions
    const rolePermissions = roles.flatMap(role =>
        permissions.map(permission => ({
            roleId: role.id,
            permissionId: permission.id,
        }))
    );

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

    // Seed Team Channels
    const teamChannels = teams.flatMap(team =>
        channels.map(channel => ({
            teamId: team.id,
            channelId: channel.id,
        }))
    );

    // Seed Team Member Roles
    const teamMemberRoles = teamMembers.flatMap(member =>
        roles.map(role => ({
            teamMemberId: member.id,
            roleId: role.id,
            assignedAt: faker.date.recent(),
        }))
    );

    // Seed User Roles (global roles)
    const userRoles = users.flatMap(user =>
        roles.map(role => ({
            userId: user.id,
            roleId: role.id,
            assignedAt: faker.date.recent(),
        }))
    );

    // Insert data
    await db.insert(usersTable).values(users);
    await db.insert(rolesTable).values(roles);
    await db.insert(permissionsTable).values(permissions);
    await db.insert(teamsTable).values(teams);
    await db.insert(channelsTable).values(channels);
    await db.insert(rolePermissionsTable).values(rolePermissions);
    await db.insert(teamMembersTable).values(teamMembers);
    await db.insert(teamChannelsTable).values(teamChannels);
    await db.insert(teamMemberRolesTable).values(teamMemberRoles);
    await db.insert(userRolesTable).values(userRoles);

    console.log('Seed data inserted successfully');
}