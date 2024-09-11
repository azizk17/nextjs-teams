import { SignUpForm } from "../_forms";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
export async function PageCenter() {
    const { isAuthenticated } = await auth()
    if (isAuthenticated) {
        redirect("/")
    }
    return (
        <div className=" flex items-center justify-center h-screen">
            <SignUpForm />
        </div>
    )
}


export default async function Page() {
    const { isAuthenticated } = await auth()
    if (isAuthenticated) {
        redirect("/")
    }
    return (
        <div className="w-full h-full lg:grid  lg:grid-cols-2 ">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <SignUpForm />
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/placeholder.svg"
                    alt="Image"
                    width="1920"
                    height="10"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
