import db from "@/db";
import { Role, rolesTable, User, userRolesTable, usersTable } from "@/db/schema";
import { UserDto, UserDto2 } from "@/dto/UserDto";
import { eq } from "drizzle-orm";
import _ from "lodash";

const dto = new UserDto();

/**
 * Retrieves a user by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Record<string, any>>} A promise that resolves to the user data.
 */
export async function getById(id: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return UserDto2(user);
}
// get by id with roles
export async function getByIdWithRoles(id: string) {
    // 1. check for authz
    // 2. get user
    // 3. transform to dto
    // 4. return

    const user = await db.select().from(usersTable)
        .leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
        .leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
        .where(eq(usersTable.id, id));

    const result = _.chain(user)
        .groupBy('users.id')
        .map((group: any[]) => ({
            ..._.omit(group[0].users, 'password'),
            roles: group.map((item: any) => ({
                id: item.roles?.id,
                name: item.roles?.name,
                assignedAt: item.user_roles?.assignedAt
            })).filter((role) => role.id !== undefined)
        }))
        .value();
    return result?.[0] ?? null;
}

/**
 * Creates a new user.
 * @param {Object} data - The user data.
 * @param {string} data.email - The email of the user.
 * @param {string} data.password - The password of the user.
 * @returns {Promise<User>} A promise that resolves to the created user.
 */
export async function create(data: { email: string; password: string }) {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user;
}

/**
 * Updates a user's information.
 * @param {string} id - The ID of the user to update.
 * @param {Object} data - The data to update.
 * @param {string} data.email - The new email of the user.
 * @param {string} data.password - The new password of the user.
 * @returns {Promise<User>} A promise that resolves to the updated user.
 */
export async function update(id: string, data: { email: string; password: string }) {
    const [user] = await db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning();
    return user;
}

/**
 * Deletes a user.
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<void>}
 */
export async function deleteUser(id: string) {
    await db.delete(usersTable).where(eq(usersTable.id, id));
}

/**
 * Retrieves all users with their roles.
 * @returns {Promise<any[]>} A promise that resolves to an array of users with their roles.
 */
export async function getAll() {
    const users = await db.select().from(usersTable)
        .leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
        .leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id));
    // return users.map(UserDto2);
}

/**
 * Retrieves all users with their roles using a nested query.
 * @returns {Promise<any[]>} A promise that resolves to an array of users with their roles.
 */
export async function getAllWithRoles() {
    const result = await db.query.usersTable.findMany({
        limit: 2,
        with: {
            roles: {
                with: {
                    role: true
                }
            }
        }
    })
    return result;
}

/**
 * Retrieves all users with their roles in a flat structure.
 * @returns {Promise<any[]>} A promise that resolves to an array of users with their roles.
 */
export async function getAllWithRolesFlat() {
    const users = await db
        .select()
        .from(usersTable)
        .leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
        .leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
        .limit(2);
    return users;
}

/**
 * Retrieves a user by their email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<User | null>} A promise that resolves to the user or null if not found.
 */
export async function getByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
}

/**
 * Generates a verification code for a user.
 * @param {string} userId - The ID of the user.
 * @param {string} email - The email of the user.
 * @param {string} type - The type of verification.
 * @throws {Error} Throws an error as this function is not implemented.
 */
export async function generateVerificationCode(userId: string, email: string, type: string) {
    throw new Error("Not implemented");
}

/**
 * Retrieves a token by its hashed value.
 * @param {string} hashed - The hashed token.
 * @throws {Error} Throws an error as this function is not implemented.
 */
export async function getToken(hashed: string) {
    throw new Error("Not implemented");
}

/**
 * Creates a new token.
 * @param {Object} data - The token data.
 * @param {string} data.token - The token string.
 * @param {string} data.userId - The ID of the user associated with the token.
 * @param {string} data.type - The type of the token.
 * @param {Date} data.expiresAt - The expiration date of the token.
 * @returns {Promise<any>} A promise that resolves to the created token.
 */
export async function createToken(data: { token: string; userId: string; type: string; expiresAt: Date }) {
    const [token] = await db.insert(tokensTable).values(data).returning();
    return token;
}

/**
 * Verifies a user's email using a verification code.
 * @param {string} code - The verification code.
 * @throws {Error} Throws an error as this function is not implemented.
 */
export async function verifyEmail(code: string) {
    throw new Error("Not implemented");
}