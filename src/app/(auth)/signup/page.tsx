import { SignUpForm } from "../_forms";
import { auth } from "@/services/authService";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Sign up to our platform',
}

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
        <div className="w-full h-full lg:grid lg:grid-cols-5">
            <div className="lg:col-span-2 flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <SignUpForm />
                </div>
            </div>
            <div className="hidden lg:col-span-3 lg:flex lg:items-center lg:justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
                <div className="relative z-10 text-white text-center p-12">
                    <h2 className="text-6xl font-bold mb-6 animate-fade-in">Welcome to Our Platform</h2>
                    <p className="text-2xl mb-12 animate-fade-in-up">Join our community and start your journey today!</p>
                    <div className="w-40 h-40 mx-auto mb-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-20 h-20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div className="flex justify-center space-x-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-4 h-4 rounded-full bg-white/50 " style={{ animationDelay: `${i * 200}ms` }}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
