"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startTransition, useActionState, useEffect, useState } from "react";
import { signin, signup, resetPassword, signout, sendOtp, verifyOtp, resendOtp } from "./_actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, Loader, Loader2, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Token } from "@/db/schema";


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
                            <div className="grid  gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input name="name" id="name" placeholder="Max" required />
                                    {state.errors?.name && (<div className="text-red-500">{state.errors.name}</div>)}
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
                                Sign up with GitHub <GitHubLogoIcon className="w-4 h-4 ms-2" />
                            </Button>
                            <Button type={"button"} variant="outline" className="w-full" disabled>
                                Sign up with Google
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
 * Password reset request form component
 * 
 */
export function PasswordResetRequestForm() {
    const [state, formAction, isPending] = useActionState(sendOtp, {});
    const router = useRouter();
    useEffect(() => {
        if (state.success) {
            toast.success("A password reset email has been sent to your email address")
            router.push(`/reset-p?token=${state.data.id}&otp=true`)
        }
        if (state.success === false) {
            toast.error(state.message)
        }
    }, [state])
    return (
        <form action={formAction} className="w-full max-w-lg">
            <Card>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your email to receive a password reset email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <Button type="submit" className="w-full">
                        {isPending ? "Sending..." : "Send Password Reset Email"}
                    </Button>
                </CardContent>
                <CardFooter>
                    <Link href="/signin" className="text-sm text-muted-foreground hover:underline">
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </form>
    )
}
/**
 * 
 * OTP verification form component
 * 
 */
export function OtpVerificationForm({ token }: { token: Token }) {
    const [state, formAction, isPending] = useActionState(verifyOtp, {});
    const [resendOtpState, formActionResendOtp, isPendingResendOtp] = useActionState(resendOtp, null);
    const [countdown, setCountdown] = useState(0);
    const searchParams = useSearchParams();
    const tokenId = searchParams.get('token') || '';
    const router = useRouter();

    const handleOtpComplete = (otp: string) => {
        const formData = new FormData();
        formData.append('otp', otp);
        formData.append('token', tokenId);
        startTransition(() => {
            formAction(formData);
        });
    };

    useEffect(() => {
        if (state.success) {

            toast.success("OTP verified successfully")
            router.replace(`/reset-p?token=${tokenId}`)
        }
        if (state.success === false) {
            toast.error(state.message)
        }
    }, [state])



    // resend otp
    useEffect(() => {
        if (resendOtpState?.success) {
            toast.success("A new verification code has been sent to your email address")
            router.replace(`/reset-p?token=${resendOtpState.data.id}&otp=true`)
        }
        if (resendOtpState?.success === false) {
            toast.error(resendOtpState.message)
        }
    }, [resendOtpState])

    useEffect(() => {
        if (token.createdAt) {
            const tokenCreationTime = new Date(token.createdAt).getTime();
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - tokenCreationTime) / 1000);
            const remainingSeconds = Math.max(180 - elapsedSeconds, 0);
            setCountdown(remainingSeconds);
        }
    }, [token.createdAt]);

    // countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const interval = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [countdown])
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardDescription>
                    {countdown}
                </CardDescription>
                <CardTitle>Verify Code</CardTitle>
                <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        {isPending && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        )}
                        <InputOTP maxLength={6} onComplete={handleOtpComplete} disabled={isPending}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                                <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                                <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                                <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                                <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className="flex justify-center">

                        <Button
                            variant="link"
                            className=""
                            disabled={isPending || countdown > 0 || isPendingResendOtp}
                            onClick={() => {
                                const formData = new FormData();
                                formData.append('token', tokenId);
                                startTransition(() => {
                                    formActionResendOtp(formData);
                                });
                            }}
                        >
                            {countdown > 0
                                ? `Resend in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
                                : "Resend verification code"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}
/**
 * 
 * New password form component
 * 
 */
export function NewPasswordForm() {
    const [state, formAction, isPending] = useActionState(resetPassword, {});
    const searchParams = useSearchParams();
    const tokenId = searchParams.get('token') || '';

    useEffect(() => {
        // on success redirect to signin
        if (state.success === false) {
            toast.error(state.message)
        }
    }, [state])
    return (
        <form action={formAction} className="w-full max-w-lg">
            <Card>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your new password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    <input type="hidden" name="token" value={tokenId} />
                    <div className="space-y-2">
                        <Label htmlFor="new_password">New Password</Label>
                        <Input
                            id="new_password"
                            name="new_password"
                            type="password"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        {isPending ? "Resetting..." : "Reset Password"}
                    </Button>
                </CardContent>
            </Card>
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
