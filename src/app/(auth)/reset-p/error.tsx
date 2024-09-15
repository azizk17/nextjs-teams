"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useEffect } from "react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                        <span>Error Occurred</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {error.message || 'An unexpected error occurred.'}
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    {/* <Button
                        className="w-full"
                        onClick={() => {
                            // Attempt to recover by trying to re-render the segment
                            reset();
                            console.log('Attempting to recover from error');
                        }}
                    >
                        Try Again
                    </Button> */}
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            window.location.href = '/signin';
                        }}
                    >
                        Back to Sign In
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
