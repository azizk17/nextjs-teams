"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startTransition, useActionState, useEffect, useState } from "react";
import { signin, signup, resetPassword, signout, resendVerificationCode, sendOtp, verifyOtp } from "./_actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle, Info, InfoIcon, Loader, Loader2, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter, useSearchParams } from "next/navigation";
import AnimateIn from "@/components/animate-in";
import { toast } from "sonner";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";


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
 * Send verification code form component
 * 
 */
export function PasswordResetForm({ tokenKey }: { tokenKey: string }) {
    const [stateSendOtp, formActionSendOtp, isPendingSendOtp] = useActionState(sendOtp, null);
    const [verifyOtpState, verifyOtpAction, isVerifyOtpPending] = useActionState(verifyOtp, null);
    const [resetPasswordState, resetPasswordAction, isResetPasswordPending] = useActionState(resetPassword, null);

    const searchParams = useSearchParams();
    const step = searchParams.get('step') || 'email';
    const email = searchParams.get('email') || '';

    const handleOtpComplete = (otp: string) => {
        const formData = new FormData();
        formData.append('otp', otp);
        startTransition(() => {
            verifyOtpAction(formData);
        });
    };

    useEffect(() => {
        if (stateSendOtp?.success) {
            toast("A verification code has been sent to your email address")
        }
        if (stateSendOtp?.success === false) {
            toast.error(stateSendOtp.message)
        }
    }, [stateSendOtp]);

    useEffect(() => {
        if (verifyOtpState?.success) {
            toast("OTP verified successfully")
        }
    }, [verifyOtpState?.success]);

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>{
                    step === 'email' ? 'Reset Password' :
                        step === 'otp' ? 'Verify Code' :
                            'Set New Password'
                }</CardTitle>
                <CardDescription>{
                    step === 'email' ? 'Enter your email to receive a verification code' :
                        step === 'otp' ? 'Enter the 6-digit code sent to your email' :
                            'Choose a new password for your account'
                }</CardDescription>
            </CardHeader>
            <CardContent>
                {step === 'email' && (
                    <form action={formActionSendOtp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                defaultValue={email}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            {isPendingSendOtp ? "Sending..." : "Send Verification Code"}
                        </Button>
                    </form>
                )}

                {step === 'otp' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            {isVerifyOtpPending && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            )}
                            <InputOTP maxLength={6} onComplete={handleOtpComplete} disabled={isVerifyOtpPending}>
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
                        <Button
                            variant="link"
                            className="w-full"
                            onClick={() => {
                                // Implement logic to resend OTP
                                toast("Resending verification code...");
                            }}
                        >
                            Resend verification code
                        </Button>
                    </div>
                )}

                {step === 'password' && (
                    <form action={resetPasswordAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            {isResetPasswordPending ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                {step !== 'email' && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            // Implement logic to go back to previous step
                        }}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                )}
                <Link href="/signin" className="text-sm text-muted-foreground hover:underline">
                    Back to Sign In
                </Link>
            </CardFooter>
        </Card>
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
// /**
//  * 
//  * Resend verification code action component
//  * 
//  */
// export function ResendVerificationCode({ type, value, label, className, createdAt }: {
//     type: string,
//     value: string, label: string, className: string, createdAt: Date | null
// }) {
//     const [state, formAction, isPending] = useActionState(resendVerificationCode, {});

//     const [timer, setTimer] = useState(0);
//     const [lastSent, setLastSent] = useState<Date | null>(createdAt);


//     // enable the button after the timer is done, start the timer based on the enableIn prop
//     // if the timer is not started yet
//     useEffect(() => {
//         if (lastSent && !timer) {
//             const diff = Math.floor((lastSent.getTime() + 60000 - Date.now()) / 1000);
//             if (diff > 0) {
//                 setTimer(diff);
//             }
//         }
//         if (timer > 0) {
//             const interval = setInterval(() => {
//                 setTimer(timer - 1);
//             }, 1000);
//             return () => clearInterval(interval);
//         }
//     }, [timer, lastSent]);

//     useEffect(() => {
//         if (state.success) {
//             setLastSent(state.data.createdAt);
//             toast.success("A new verification code has been sent to your email address")
//         }
//         if (state.error) {
//             toast.error(state.message, {});
//         }
//     }
//         , [state]);


//     return (
//         <form action={formAction}>
//             <input type="hidden" name="type" value={type} />
//             <input type="hidden" name="value" value={value} />
//             <Button type="submit" variant="ghost" className={cn(className)} disabled={isPending || timer > 0}>
//                 {isPending ? "Sending..." : "Resend verification code" + (timer > 0 ? ` in ${timer}s` : "")}
//             </Button>
//         </form>
//     )
// }
