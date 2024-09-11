import { getToken } from "@/services/tokens";
import { RestPasswordForm } from "../../_forms";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { createHash } from "crypto";

export default async function Page({ params }: { params: { token: string } }) {
    // check if token is valid and not expired
    console.log("params", params);
    const hash = await createHash('sha256').update(params.token).digest('hex');
    const token = await getToken(hash);


    if (!token || new Date(token.expiresAt) < new Date()) {
        // token is invalid or expired
        return (
            <div className=" flex items-center justify-center  h-screen">
                <div className="text-center flex flex-col items-center justify-center gap-5">
                    <Info className="w-24 h-24 text-muted-foreground" />
                    <h1 className="text-3xl font-bold text-muted-foreground">Invalid or expired token</h1>
                    <p className=" text-muted-foreground">The token you are using is invalid or expired. Please try again.</p>
                    <Link href="/signin" className=" flex items-center justify-start text-muted-foreground hover:text-primary">
                        <ArrowLeft className="w-6 h-6 me-2" />
                        Go back to sign in
                    </Link>
                </div>
            </div>
        )
    }
    return (
        <div className=" flex items-center justify-center h-screen">
            <RestPasswordForm token={params.token} />
        </div>
    )
}