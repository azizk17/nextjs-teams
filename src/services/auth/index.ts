import { validateRequest } from "./lucia-auth"
export const user = async () => {
    const { user } = await validateRequest()
    return user
}

export const isAuthenticated = async () => {
    const { session } = await validateRequest()
    return !!session
}

export const auth = async () => {
    // const { user, isAuthenticated } = await validateRequest()
    return {
        user: {
            id: "2",
            email: "test@test.com",
            password: "test",
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        },
        isAuthenticated: true,
    }
}