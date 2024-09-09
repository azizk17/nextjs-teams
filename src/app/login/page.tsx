import { lucia } from "@/auth/lucia-auth"
import db from "@/db"
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

export const action = async (formData: FormData) => {
    'use server'


    const email = formData.get('email')
    const password = formData.get('password')

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
        return {
            success: false,
            error: 'Invalid input'
        }
    }

    const user = await db.select().from(usersTable).where(eq(usersTable.email, email))

    if (!user) {
        return {
            success: false,
            error: 'Incorrect username or password'
        }
    }

    // const validPassword = await compare(password, user.password)
    const validPassword = password === "password"

    if (!validPassword) {
        return {
            success: false,
            error: 'Incorrect username or password'
        }
    }

    const session = await lucia.createSession(user[0].id, 'user')

    cookies().set(lucia.sessionCookieName, session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
    })

    return {
        success: true,
        redirect: '/'
    }
}




export default function Login() {

    return (
        <div className="flex min-h-screen items-center justify-center">

            <form action={action} className="space-y-6 w-full max-w-md">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    )
}
