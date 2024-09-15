import { getTokenById } from "@/services/userService";
import { NewPasswordForm, OtpVerificationForm, PasswordResetForm, PasswordResetRequestForm } from "../_forms";

export default async function Page({ searchParams }: { searchParams: { token: string, otp: string } }) {

    const otp = searchParams.otp;
    // TODO: check if token is valid
    // TODO: if token is valid, show the form
    // TODO: if token is invalid, show the error
    if (!searchParams.token) {
        return <div className=" flex items-center justify-center h-screen">
            <PasswordResetRequestForm />
        </div>
    }


    const token = await getTokenById(searchParams.token);
    if (searchParams.token && (!token || token.expiresAt < new Date())) {
        throw new Error("Invalid or expired token")
    }


    return <div className=" flex items-center justify-center h-screen">
        {otp ? <OtpVerificationForm token={token} /> : <NewPasswordForm token={token} />}
    </div>
}

