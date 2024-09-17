import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
                <h1 className="text-4xl font-bold text-foreground mb-4">401 - Unauthorized</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Sorry, you are not authorized to access this page.
                </p>
                <Button asChild>
                    <Link href="/signin">
                        Sign In
                    </Link>
                </Button>
            </div>
        </div>
    );
}
