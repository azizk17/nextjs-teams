import db from "@/db";
import { InsertToken, InsertUser, Permission, permissionsTable, Role, rolePermissionsTable, rolesTable, Token, tokensTable, User, userRolesTable, usersTable } from "@/db/schema";
import { addHours } from "date-fns";
import { eq, and, desc, inArray } from "drizzle-orm";
import _ from "lodash";
import { customAlphabet } from "nanoid";




// Users
// -------------------------------------------------------------------------------------------------
/**
 * Retrieves a user by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Record<string, any>>} A promise that resolves to the user data.
 */
export async function getUser(id: string) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return user;
}
// get by id with roles
export async function getUserWithRoles(id: string) {
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
export async function createUser(data: InsertUser) {
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
export async function updateUser(id: string, data: Partial<InsertUser>) {
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
export async function getAllUsers() {
    const users = await db.select().from(usersTable)
        .leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
        .leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id));
    // return users.map(UserDto2);
}

/**
 * Retrieves all users with their roles using a nested query.
 * @returns {Promise<any[]>} A promise that resolves to an array of users with their roles.
 */
export async function getAllUsersWithRoles() {
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
export async function getAllUsersWithRolesFlat() {
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
export async function getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
}

/**
 * Retrieves a user by their username.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<User | null>} A promise that resolves to the user or null if not found.
 */
export async function getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
    return user;
}



// Tokens
// -------------------------------------------------------------------------------------------------
/**
 * Generate a verification code
 * @param userId
 * @param email
 * @param type
 * @returns Promise<string>
 * */
export async function generateVerificationCode(userId: string, email: string, type = "email_verification"): Promise<Token> {
    return await db.transaction(async (tx) => {
        // Disable existing tokens of the same type for this user
        await tx.update(tokensTable)
            .set({ isInvalid: true })
            .where(and(
                eq(tokensTable.userId, userId),
                eq(tokensTable.type, type as any)
            ));
        // Generate a new code
        const code = customAlphabet("1234567890", 6)();

        // Insert the new token
        const [newToken] = await tx.insert(tokensTable)
            .values({
                userId,
                token: code,
                type: type as any,
                expiresAt: addHours(new Date(), 1)
            })
            .returning();

        return newToken;
    });
}
/**
 * Verify a verification code
 * @param user
 * @param code
 * @param type
 * @returns Promise<boolean>
 * */
export async function verifyVerificationCode(tokenId: string, code: string, type = "email_verification"): Promise<{ isValid: boolean, expiresAt: Date | null, createdAt: Date | null }> {
    return await db.transaction(async (tx) => {
        const token = await tx.select().from(tokensTable).where(and(eq(tokensTable.id, tokenId), eq(tokensTable.token, code))).limit(1);
        // no token
        if (!token || !token[0]) {
            return { isValid: false, expiresAt: null, createdAt: null };
        }
        // expired
        if (token[0].expiresAt < new Date()) {
            return { isValid: false, expiresAt: token[0].expiresAt, createdAt: token[0].createdAt };
        }
        // invalid type
        if (token[0].type !== type) {
            return { isValid: false, expiresAt: token[0].expiresAt, createdAt: token[0].createdAt };
        }
        // delete the token
        await tx.update(tokensTable).set({ verified: true }).where(eq(tokensTable.id, token[0].id));
        // await tx.delete(tokensTable).where(eq(tokensTable.id, token[0].id));
        return { isValid: true, expiresAt: token[0].expiresAt, createdAt: token[0].createdAt };
    }
    );
}


/**
 * Retrieves a token by its hashed value.
 * @param {string} id - The id of the token.
 * @throws {Error} Throws an error as this function is not implemented.
 */
export async function getTokenById(id: string) {
    const [token] = await db.select().from(tokensTable).where(eq(tokensTable.id, id));
    return token;
}
/**
 * Retrieves a token by its hashed value.
 * @param {string} hashed - The hashed token.
 * @throws {Error} Throws an error as this function is not implemented.
 */
export async function getTokenByHashedToken(hashedToken: string) {
    const [token] = await db.select().from(tokensTable).where(eq(tokensTable.token, hashedToken));
    return token;
}

/**
 * Retrieves the most recent token by its user ID and type.
 * @param {string} userId - The ID of the user.
 * @param {string} type - The type of the token.
 * @returns {Promise<Token | null>} A promise that resolves to the most recent token or null if not found.
 */
export async function getLastTokenByUserIdAndType(userId: string, type: "email_verification" | "password_reset" | "phone_verification"): Promise<Token | null> {
    const [token] = await db.select()
        .from(tokensTable)
        .where(and(eq(tokensTable.userId, userId), eq(tokensTable.type, type)))
        .orderBy(desc(tokensTable.createdAt))
        .limit(1);
    return token;
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
export async function createToken(data: InsertToken) {
    const [token] = await db.insert(tokensTable).values(data).returning();
    return token;
}

/**
 * Deletes a token by its ID.
 * @param {string} id - The ID of the token to delete.
 * @returns {Promise<void>}
 */
export async function deleteToken(id: string) {
    await db.delete(tokensTable).where(eq(tokensTable.id, id));
}
/**
 * Invalidates a token by its ID.
 * @param {string} id - The ID of the token to invalidate.
 * @returns {Promise<void>}
 */
export async function invalidateToken(id: string) {
    await db.update(tokensTable).set({ isInvalid: true }).where(eq(tokensTable.id, id));
}
/**
 * Verifies a user's email using a verification code.
 * @param {string} code - The verification code.
 * @throws {Error} Throws an error as this function is not implemented.
 */
export async function verifyEmail(code: string) {
    throw new Error("Not implemented");
}



// Roles & Permissions
// -------------------------------------------------------------------------------------------------
/**
 * Retrieves a role by its name.
 * @param {string} roleName - The name of the role to retrieve.
 * @returns {Promise<Role | null>} A promise that resolves to the role or null if not found.
 */
export async function getRoleByName(roleName: string): Promise<Role | null> {
    const [role] = await db.select().from(rolesTable).where(eq(rolesTable.name, roleName));
    return role;
}

export async function getRoleId(roleName: string): Promise<number | null> {
    const role = await getRoleByName(roleName);
    return role?.id ?? null;
}

/**
 * Retrieves a user's roles.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Role[]>} A promise that resolves to an array of roles.
 */
export async function getUserRoles(userId: string): Promise<Role[]> {
    const roles = await db
        .select({
            id: rolesTable.id,
            name: rolesTable.name,
            description: rolesTable.description,
        })
        .from(userRolesTable)
        .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
        .where(eq(userRolesTable.userId, userId));

    return roles;
}
/**
 * Retrieves a user's permissions.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Permission[]>} A promise that resolves to an array of permissions.
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
    const permissions = await db
        .select({
            id: permissionsTable.id,
            name: permissionsTable.name,
            description: permissionsTable.description,
        })
        .from(userRolesTable)
        .innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
        .innerJoin(rolePermissionsTable, eq(rolesTable.id, rolePermissionsTable.roleId))
        .innerJoin(permissionsTable, eq(rolePermissionsTable.permissionId, permissionsTable.id))
        .where(eq(userRolesTable.userId, userId))
        .groupBy(permissionsTable.id, permissionsTable.name, permissionsTable.description);

    return permissions;
}
