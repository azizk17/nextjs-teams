"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { UnauthenticatedError } from "@/lib/errors"
import { AlertCircle } from "lucide-react"
import { redirect } from "next/dist/server/api-utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {

    const router = useRouter()
    // Check if the error is an UnauthenticatedError and redirect
    useEffect(() => {
        if (error.message === "UnauthenticatedError") {
            console.log("UnauthenticatedError ------------------")
            router.push("/")
        }
        // Log the error to an error reporting service
        console.error("Error: 2222", error.message)

    }, [error, router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                        <span>Error Occurred</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error.digest ? (
                        <p className="text-sm text-muted-foreground">
                            {`Digest: ${error.digest}`}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {error.message || 'An unexpected error occurred.'}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        {error.message || 'An unexpected error occurred.'}
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    {/* <Button
                        className="w-full"
                        onClick={() => {
                            reset()
                        }}
                    >
                        Try again
                    </Button> */}
                </CardFooter>
            </Card>
        </div>
    )
}


