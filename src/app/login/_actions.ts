import { lucia } from "@/auth/lucia-auth";
import db from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod";

const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2).optional(),
});

type ActionResult = {
    success: boolean;
    status: number;
    errors?: Record<string, string[]>;
    message?: string;
};

//------------------------------------- Sign in -------------------------------------//
export async function signin(_: any, formData: FormData): Promise<ActionResult> {
    const validated = CreateUserSchema.pick({ email: true, password: true }).safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validated.success) {
        return { success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'Invalid form data', }
    }
    try {
        // existing user check
        const user = await db.select().from(usersTable).where(eq(usersTable.email, validated.data.email)).limit(1)

        // if user does not exist
        if (!user) {
            return { success: false, status: 400, message: "Incorrect username or password", };
        }
        // check password
        const validPassword = await verify(user?.password, validated.data.password);
        if (!validPassword) {
            return { success: false, status: 400, message: "Incorrect username or password", };
        }

        const session = await lucia.createSession(user?.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } catch (error) {
        return { success: false, status: 400, message: "Incorrect username or password", };
    }
    return redirect("/");
}