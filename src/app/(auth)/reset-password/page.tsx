import { SendRestPasswordForm } from "../_forms"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page() {
    const { isAuthenticated } = await auth()
    if (isAuthenticated) {
        redirect("/")
    }
    return (
        <div className=" flex items-center justify-center h-screen">
            <SendRestPasswordForm />
        </div>
    )

}
