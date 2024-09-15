'use server'

import { z } from "zod";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/services/auth/lucia-auth"
import { RedirectType, redirect } from "next/navigation";
import { ActionResponse } from "@/types";

import { sendEmail } from "@/utils/email";
import { CreateUserSchema, Token, User } from "@/db/schema";
import {
    createUser, generateVerificationCode, getLastTokenByUserIdAndType, getTokenById, getUser, getUserByEmail, invalidateToken, updateUser, verifyVerificationCode
} from "@/services/userService";



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
    const validated = z.object({
        email: z.string(),
    }).safeParse({
        email: formData.get('email'),
    })

    if (!validated.success) {
        console.log(validated.error.flatten().fieldErrors)
        return {
            success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'You must provide a valid information',
        }
    }

    // exsiting user check 
    const existingUser = await getUserByEmail(validated.data.email);
    if (!existingUser) {
        return { success: false, status: 404, message: "No account found with this email address" };
    }

    // check if the user has a password reset token in the last 3 minutes
    const lastToken = await getLastTokenByUserIdAndType(existingUser.id, "password_reset");
    if (lastToken) {
        const now = new Date();
        const lastTokenDate = new Date(lastToken.createdAt || "");
        const timeDifference = now.getTime() - lastTokenDate.getTime();
        const minutesDifference = timeDifference / (1000 * 60);
        if (minutesDifference < 3) {
            return { success: false, status: 400, message: "Please wait 3 minutes before requesting another code" }
        }
    }

    const { token, id, createdAt } = await generateVerificationCode(existingUser.id, existingUser.email, "password_reset");
    // send email verification email
    await sendEmail({
        to: existingUser.email,
        subject: "Password reset",
        template: `Your password reset code is ${token}`
    });
    return { success: true, message: "Verification code sent", data: { id, email: existingUser.email, createdAt: createdAt } }
}

// Resend verification code
// --------------------------------------------------------------------------------
export async function resendOtp(_: any, formData: FormData): Promise<ActionResponse> {
    const validated = z.object({
        token: z.string().min(8, {
            message: "Invalid token",
        }),
    }).safeParse({
        token: formData.get('token'),
    })
    if (!validated.success) {
        console.log(validated.error.flatten().fieldErrors)
        return {
            success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'You must provide a valid information',
        }
    }
    const { id: prevId, userId, createdAt: prevCreatedAt } = await getTokenById(validated.data.token);
    if (!prevId) {
        return { success: false, status: 400, message: "Invalid token" }
    }

    // check if the user has a password reset token in the last 3 minutes
    if (prevId && prevCreatedAt) {
        const now = new Date();
        const lastTokenDate = new Date(prevCreatedAt);
        const timeDifference = now.getTime() - lastTokenDate.getTime();
        const minutesDifference = timeDifference / (1000 * 60);
        if (minutesDifference < 3) {
            return { success: false, status: 400, message: "Please wait 3 minutes before requesting another code" }
        }
    }

    const user = await getUser(userId);
    if (!user) {
        return { success: false, status: 400, message: "User does not exist" }
    }
    const { id: newId, token, createdAt: newCreatedAt } = await generateVerificationCode(userId, user.email, "password_reset");
    await sendEmail({
        to: user.email,
        subject: "Password reset",
        template: `Your password reset code is ${token}`
    });
    return { success: true, message: "Verification code sent", data: { id: newId, userId, createdAt: newCreatedAt } }
}

// Verify OTP
// --------------------------------------------------------------------------------
export async function verifyOtp(_: any, formData: FormData): Promise<ActionResponse> {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const validated = z.object({
        otp: z.string().min(6, {
            message: "Invalid code",
        }),
        token: z.string().min(8, {
            message: "Invalid token",
        }),
    }).safeParse({
        otp: formData.get('otp'),
        token: formData.get('token'),
    })
    if (!validated.success) {
        console.log(validated.error.flatten().fieldErrors)
        console.log(validated.data)
        return {
            success: false, status: 400, errors: validated.error.flatten().fieldErrors, message: 'You must provide a valid information',
        }
    }
    const { isValid } = await verifyVerificationCode(validated.data.token, validated.data.otp, "password_reset");
    if (!isValid) {
        return { success: false, status: 400, message: "Invalid code" }
    }

    return { success: true, message: "OTP verified successfully", data: { id: validated.data.token } }
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
        // const hashed = await createHash('sha256').update(validated.data.token).digest('hex');
        const token = await getTokenById(validated.data.token);
        // check expiration
        if (!token || new Date(token.expiresAt) < new Date()) {
            return { success: false, status: 400, message: "Invalid token", };
        }
        if (token.type !== "password_reset") {
            return { success: false, status: 400, message: "Invalid token", };
        }
        if (!token.verified || token.isInvalid) {
            return { success: false, status: 400, message: "Token is invalid", };
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
        await invalidateToken(token.id);
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
