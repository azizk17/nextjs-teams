import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/services/authService";
import { Grab, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { isAuthenticated } = await auth()
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to the new and improved <span className="text-blue-500">Project Management System</span></h1>
          <p className="text-xl mb-8">Manage your projects and teams efficiently</p>
          <div className="flex gap-4 justify-center">

            {isAuthenticated ? (
              <Link
                href="/projects"
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                <Grab className="w-4 h-4 mr-2" />
                Projects
              </Link>
            ) : (
              <Link
                href="/signin"
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; 2023 My App. All rights reserved.</p>
      </footer>
    </div>
  );
}
