import AnimateIn from "@/components/animate-in"

import { auth } from "@/lib/auth"
import { updateUser, verifyVerificationCode } from "@/services/users"
import { CheckCircle, CheckCircle2, Info, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ResendVerificationCode } from "../_forms"

// TODO: this page should be accessible only when user is not logged in
// TODO: if email is already verified, redirect to dashboard
export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const code = searchParams.code as string
    // dont allow user to access this page if they are already logged in
    const { isAuthenticated, user } = await auth()
    const { isValid, createdAt } = await verifyVerificationCode(user.id, code, "email_verification")
    // sleep for 2 seconds to simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (isValid) {
        // update user's email verification status
        await updateUser(user.id, { email_verified: true })
        // redirect to dashboard
        redirect("/dashboard")
    }
    if (!isAuthenticated) {
        return (
            <div className=" flex items-center justify-center h-screen">
                <div className="text-center flex flex-col items-center justify-center gap-5">
                    <ShieldAlert className="w-24 h-24 text-muted-foreground" />
                    <h1 className="text-3xl font-bold text-muted-foreground">You are not signed in</h1>
                    <p className=" text-muted-foreground">You need to sign in to access this page.</p>
                    <Link href="/signin" className=" flex items-center justify-start text-muted-foreground hover:text-primary">
                        Go back to sign in
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className=" flex items-center justify-center h-screen">
            <div className="text-center flex flex-col items-center justify-center gap-5">
                {isValid ? (
                    <>
                        <AnimateIn from="opacity-0 scale-125 rotate-45 blur-lg" to="opacity-100 scale-100 rotate-0 blur-none">
                            <CheckCircle className="w-24 h-24 text-green-500" />
                        </AnimateIn>
                        <h1 className="text-3xl font-bold text-muted-foreground">Verification code is valid</h1>
                        <p className=" text-muted-foreground">You can now access this page.</p>
                        <Link href="/dashboard" className=" flex items-center justify-start text-muted-foreground hover:text-primary">
                            Go to dashboard
                        </Link>
                    </>
                ) : (
                    <>
                        <ShieldAlert className="w-24 h-24 text-muted-foreground" />
                        <h1 className="text-3xl font-bold text-muted-foreground">Verification code is invalid or expired</h1>
                        <p className=" text-muted-foreground">Please make sure you have the correct verification code.</p>
                        <ResendVerificationCode className="w-full" label="Resend verification code" createdAt={createdAt} />
                    </>
                )}
            </div>
        </div >
    )

}
