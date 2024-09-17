"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { UnauthenticatedError } from "@/lib/errors"
import { cn } from "@/lib/utils"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { redirect } from "next/dist/server/api-utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const errorMap = {
    UnauthenticatedError: {
        message: "You are not authenticated to access this page.",
        title: "Authentication Error"
    },
    ForbiddenError: {
        message: "You don't have permission to access this resource.",
        title: "Access Denied"
    },
    NotFoundError: {
        message: "The requested resource could not be found.",
        title: "Not Found"
    },
    // Add more error types as needed
};
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState(error.message);
    const [errorTitle, setErrorTitle] = useState("Error Occurred");
    useEffect(() => {
        const errorType = error.message as keyof typeof errorMap;
        if (errorType in errorMap) {
            setErrorMessage(errorMap[errorType].message);
            setErrorTitle(errorMap[errorType].title);
        }
        console.error("Error:", error.message)
    }, [error, router])



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
                <h1 className="text-4xl font-bold text-foreground mb-4">{errorTitle}</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    {errorMessage}
                </p>

                {error.message === "UnauthenticatedError" ? (
                    <Link href="/signin" className={cn(buttonVariants({ variant: "outline" }))}>
                        Sign in
                    </Link>
                ) : (
                    <>
                        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
                            Return to Home
                        </Link>
                        <Button
                            variant="outline"
                            className="ml-4"
                            onClick={() => reset()}
                        >
                            Back
                        </Button>
                    </>
                )}

            </div>
        </div>
    );
}


