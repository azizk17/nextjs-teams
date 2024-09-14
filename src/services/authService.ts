import { validateRequest } from "./auth/lucia-auth"

export async function auth() {
    const { user, session } = await validateRequest()
    return {
        user,
        isAuthenticated: !!session
    }
}

export async function isAuthenticated() {
    const { isAuthenticated } = await auth()
    return isAuthenticated
}

export async function user() {
    const { user } = await auth()
    return user
}
