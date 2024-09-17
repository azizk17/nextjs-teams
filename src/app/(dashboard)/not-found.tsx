import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
                <h1 className="text-4xl font-bold text-foreground mb-4">404 - Not Found</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link href="/" passHref>
                        <Button variant="outline">Return to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
