"use client"

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Forbidden() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
                <h1 className="text-4xl font-bold text-foreground mb-4">403 - Forbidden</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Sorry, you don't have permission to access this page.
                </p>

                <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
                    Return to Home
                </Link>
                <Button
                    variant="outline"
                    className="ml-4"
                    onClick={() => router.back()}
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
}
