'use server'

import { z } from "zod";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/services/auth/lucia-auth"
import { RedirectType, redirect } from "next/navigation";
import { ActionResponse } from "@/types";

import { generateIdFromEntropySize, } from "lucia";
import { createHash, randomBytes } from 'crypto';
import { addHours } from "date-fns";
import { sendEmail } from "@/utils/email";
import { CreateUserSchema } from "@/db/schema";
import { createToken, createUser, generateVerificationCode, getToken, getUser, getUserByEmail, updateUser } from "@/services";



const resetPasswordSchema = z.object({
    new_password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirm_password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    token: z.string().min(8, {
        message: "Invalid token",
    })
}).refine(data => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
})

// Sign in
// --------------------------------------------------------------------------------
export async function signin(_: any, formData: FormData): Promise<ActionResponse> {
    const validated = CreateUserSchema.pick({ email: true, password: true }).safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validated.success) {
        return { success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'Invalid form data', }
    }
    try {
        // exsiting user check
        const user = await getUserByEmail(validated.data.email);
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

// Sign up
// --------------------------------------------------------------------------------
export async function signup(_: any, formData: FormData): Promise<ActionResponse> {

    const validated = CreateUserSchema.pick({ email: true, password: true, name: true }).safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
    })

    if (!validated.success) {
        return {
            success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'Invalid form data',
        }
    }
    try {
        // exsiting user check 
        const isExsiting = await getUserByEmail(validated.data.email);
        if (isExsiting) {
            return { success: false, status: 400, message: "User already exists", };
        }
        const passwordHash = await hash(validated?.data?.password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        const user = await createUser({ email: validated.data.email, password: passwordHash, name: validated.data.name });
        const session = await lucia.createSession(user?.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        const verificationCode = await generateVerificationCode(user?.id, user?.email, "email_verification");
        // send email verification email
        // mocking for now
        await sendEmail({
            to: user.email,
            subject: "Email verification",
            template: `Click here to verify your email: ${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${verificationCode}`,
        });
    } catch (error) {
        return { success: false, status: 400, message: "Error creating user", };
    }
    return redirect("/");
}

// Send verification code
// --------------------------------------------------------------------------------
export async function sendOtp(_: any, formData: FormData): Promise<ActionResponse> {
    const validated = CreateUserSchema.pick({ email: true }).safeParse({
        email: formData.get('email'),
    })
    if (!validated.success) {
        return {
            success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'You must provide a valid information',
        }
    }
    redirect(`/reset-p?key=${validated.data.email}&step=otp`)
    return { success: true, message: "Verification code sent", }
    // exsiting user check 
    // const existingUser = await getUserByEmail(validated.data.email);


}
export async function verifyOtp(_: any, formData: FormData): Promise<ActionResponse> {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const validated = z.object({
        otp: z.string().min(6, {
            message: "Invalid code",
        }),
    }).safeParse({
        otp: formData.get('otp'),
    })
    if (!validated.success) {
        return {
            success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'You must provide a valid information',
        }
    }
    return { success: true, message: "OTP verified successfully", }
    redirect(`/reset-p?key=${validated.data.otp}&step=password`)
}

// Send reset password
// --------------------------------------------------------------------------------
export async function sendResetPassword(_: any, formData: FormData): Promise<ActionResponse> {
    const validated = CreateUserSchema.pick({ email: true }).safeParse({
        email: formData.get('email'),
    })

    if (!validated.success) {
        return {
            success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'You must provide a valid information',
        }
    }
    // exsiting user check 
    const existingUser = await getUserByEmail(validated.data.email);

    if (!existingUser) return { success: false, status: 404, message: "This email is not registered" }

    const id = generateIdFromEntropySize(25); // 40 character
    const hash = await createHash('sha256').update(id).digest('hex');
    const createdToken = await createToken({
        token: hash,
        //@ts-ignore
        userId: existingUser?.id,
        type: "password_reset",
        expiresAt: addHours(new Date(), 3),
    });
    // send password reset email
    // mocking for now
    await sendEmail({
        to: existingUser.email,
        subject: "Password reset",
        template: `Click here to reset your password: ${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${id}`,
    });

    return { success: true, message: "Password reset email sent", }
}

// Reset password
// --------------------------------------------------------------------------------
export async function resetPassword(_: any, formData: FormData): Promise<ActionResponse> {
    const validated = resetPasswordSchema.safeParse({
        new_password: formData.get('new_password'),
        confirm_password: formData.get('confirm_password'),
        token: formData.get('token'),
    })

    if (!validated.success) {
        return { success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'Invalid form data', }
    }

    try {
        // validate token
        const hashed = await createHash('sha256').update(validated.data.token).digest('hex');
        const token = await getToken(hashed);
        // check expiration
        if (!token || new Date(token.expiresAt) < new Date()) {
            return { success: false, status: 400, message: "Invalid token", };
        }
        // exsiting user check 
        const user = await getUser(token.userId)
        if (!user) {
            return {
                success: false, status: 400, message: "User does not exist",
            };
        }
        const updatedPassword = await hash(validated.data.new_password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
        // update password
        const updated = await updateUser(user.id, { password: updatedPassword });
        if (!updated) {
            return { success: false, status: 400, message: "Error updating password", };
        }
        // invalidate token
    } catch (error) {
        return { success: false, status: 400, message: "Error resetting password", };
    }
    return redirect("/signin", RedirectType.replace);
}

// Sign out
// --------------------------------------------------------------------------------
export async function signout(): Promise<ActionResponse> {
    const { session } = await validateRequest();
    if (!session) {
        return redirect("/signin", RedirectType.replace);
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/", RedirectType.replace);
}

// Resend verification code
// --------------------------------------------------------------------------------
// TODO: Refactor to use a single function for generating verification code for email and phone
export async function resendVerificationCode(): Promise<ActionResponse> {
    // sleep for 2 seconds to simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, message: "No active session", status: 400, };
    }
    // TODO: Prevent code generation if a code was generated in the last 5 minutes

    if (user.emailVerified) {
        return { success: false, message: "Email already verified", status: 400, };
    }
    const { token: code, createdAt } = await generateVerificationCode(user.id, user.email, "email_verification");
    // send email verification email
    await sendEmail({
        to: user.email,
        subject: "Email verification",
        template: `Click here to verify your email: ${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${code}`,
    });

    return { success: true, message: "Verification code sent", data: { createdAt: createdAt } }
}