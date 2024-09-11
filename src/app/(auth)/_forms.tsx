"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState, useEffect, useState } from "react";
import { signin, signup, resetPassword, signout, sendResetPassword, resendVerificationCode } from "./_actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Info, InfoIcon, Loader, Loader2, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import AnimateIn from "@/components/animate-in";
import { toast } from "sonner";


/**
 * 
 * Sign in form component
 * 
 */
export function SignInForm() {
    const [state, formAction, isPending] = useActionState(signin, {});
    return (
        <form action={formAction}>
            {state.success === false && (
                <CardDescription>
                    <div className="text-red-500 flex items-center text-sm"><InfoIcon className="wh-5 h-5 me-1" /> {state.message}</div>
                </CardDescription>
            )}
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" name="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/reset-password" className="ml-auto inline-block text-sm underline">
                            Forgot your password?
                        </Link>
                    </div>
                    <Input name="password" id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                    {isPending ? "Processing..." : "Sign in"}
                </Button>

                <Button variant="outline" className="w-full">
                    Sign in with GitHub
                </Button>

                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </form>
    )
}

/**
 * 
 * Sign up form component
 * 
 */
export function SignUpForm() {
    const [state, formAction, isPending] = useActionState(signup, {});
    return (
        // center the card
        <div className="mx-auto max-w-sm">

            <Card >
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                {state.success === false && (<div className="text-red-500">{state.message}</div>)}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input name="firstName" id="first-name" placeholder="Max" required />
                                    {state.errors?.firstName && (<div className="text-red-500">{state.errors.firstName}</div>)}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input name="lastName" id="last-name" placeholder="Robinson" required />
                                    {state.errors?.lastName && (<div className="text-red-500">{state.errors.lastName}</div>)}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" id="email" type="email" placeholder="m@example.com" required />
                                {state.errors?.email && (<div className="text-red-500">{state.errors.email}</div>)}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input name="password" id="password" type="password" />
                                {state.errors?.password && (<div className="text-red-500">{state.errors.password}</div>)}
                            </div>
                            <Button type="submit" className="w-full">
                                {isPending ? "Processing..." : "Sign up"}
                            </Button>
                            <Button type={"button"} variant="outline" className="w-full">
                                Sign up with GitHub
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/signin" className="underline">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * 
 * Send reset password form component
 * 
 */
export function SendRestPasswordForm() {

    const [state, formAction, isPending] = useActionState(sendResetPassword, {
        error: null
    });

    return (
        <div className=" grid gap-4 mx-auto max-w-xl  ">
            <Card className=" w-full">
                {state.success && (
                    <AnimateIn from="opacity-0" to="opacity-100" className="text-center w-full min-w-full">
                        <CardContent className="flex flex-col items-center justify-center p-5 gap-5">
                            <CheckCircle className=" w-16 h-16  text-green-500" />
                            <span className=" text-muted-foreground">An email has been sent to your email address</span>
                        </CardContent>
                    </AnimateIn>
                )}

                {!state.success && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-xl">Reset Password</CardTitle>
                            <CardDescription>
                                Enter your email below to reset your password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={formAction}>
                                <div className="grid gap-4">
                                    {state.success === false && !isPending && (
                                        <div className=" flex items-center justify-start gap-2">
                                            <p className="text-red-500">{state.message}</p>
                                            {state.status === 404 && (<Link href="/signup" className=" text-muted-foreground hover:text-primary">Sign up</Link>)}
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input name="email" id="email" type="email" placeholder="m@example.com" required disabled={isPending} />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        {isPending ? "Sending..." : "Send"}
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm text-muted-foreground ">
                                    <Link href="/signin" className="hover:text-primary">
                                        Back to Sign in <ArrowRight className="inline-block w-4 h-4" />
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </>
                )}

            </Card>
        </div >
    )
}

/**
 * 
 * Reset password form component
 * 
 */
export function RestPasswordForm({ token }: { token: string }) {
    const router = useRouter()

    const [state, formAction, isPending] = useActionState(resetPassword, {
        error: null
    });

    useEffect(() => {
        if (state.success) {
            setTimeout(() => {
                router.push("/signin");
            }, 3000);
        }
    }
        , [state.success]);
    return (
        <div className="mx-auto max-w-sm w-full grid gap-4">
            {state.success && (
                <div className=" flex bg-secondary p-2 rounded-lg">
                    <Loader2 className=" w-6 h-6 text-accent-foreground me-2 animate-spin" />
                    <span className="text-accent-foreground">Your password has been reset successfully. Redirecting...</span>
                </div>
            )}
            {state.error && (<div className="text-red-500 text-sm">{state.error}</div>)}
            <Card className={cn(state.success && "opacity-70")}>
                <CardHeader>
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password below to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <input type="hidden" name="token" value={token} />
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="new_password">New Password</Label>
                                <Input name="new_password" id="new_password" type="password" required disabled={isPending || state.success} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm_password">Confirm Password</Label>
                                <Input name="confirm_password" id="confirm_password" type="password" required disabled={isPending || state.success} />
                            </div>
                            <Button type="submit" className="w-full " disabled={isPending || state.success}>
                                {isPending ? "Processing..." : "Reset Password"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <Link href="/auth/signin" className="underline">
                                Back to Sign in <ArrowRight className="inline-block w-4 h-4" />
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    )
}

// @deprecated
export function SignOutForm({ trigger, loader }: { trigger: React.ReactNode, loader: React.ReactNode }) {
    const [state, formAction, isPending] = useActionState(signout, {
        error: null
    });
    return (
        <form action={formAction}>
            {isPending ? loader : trigger}
        </form>

    )
}

/**
 * 
 * Sign out button component
 * 
 */
export function SignOutButton({ className }: { className?: string }) {
    const [state, formAction, isPending] = useActionState(signout, {
        error: null
    });
    return (

        <form action={formAction}>
            <Tooltip>
                <TooltipTrigger asChild disabled={isPending}>
                    <Button type="submit" className={cn(className)} variant="ghost" size="icon" >
                        <div className="flex items-center">
                            {isPending ? <Loader className=" animate-spin" /> : <LogOutIcon className=" w-5 h-5" />}
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>

        </form>
    )
}
/**
 * 
 * Resend verification code action component
 * 
 */
export function ResendVerificationCode({ type, value, label, className, createdAt }: {
    type: string,
    value: string, label: string, className: string, createdAt: Date | null
}) {
    const [state, formAction, isPending] = useActionState(resendVerificationCode, {});

    const [timer, setTimer] = useState(0);
    const [lastSent, setLastSent] = useState<Date | null>(createdAt);


    // enable the button after the timer is done, start the timer based on the enableIn prop
    // if the timer is not started yet
    useEffect(() => {
        if (lastSent && !timer) {
            const diff = Math.floor((lastSent.getTime() + 60000 - Date.now()) / 1000);
            if (diff > 0) {
                setTimer(diff);
            }
        }
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, lastSent]);

    useEffect(() => {
        if (state.success) {
            setLastSent(state.data.createdAt);
            toast.success("A new verification code has been sent to your email address")
        }
        if (state.error) {
            toast.error(state.message, {});
        }
    }
        , [state]);


    return (
        <form action={formAction}>
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="value" value={value} />
            <Button type="submit" variant="ghost" className={cn(className)} disabled={isPending || timer > 0}>
                {isPending ? "Sending..." : "Resend verification code" + (timer > 0 ? ` in ${timer}s` : "")}
            </Button>
        </form>
    )
}
