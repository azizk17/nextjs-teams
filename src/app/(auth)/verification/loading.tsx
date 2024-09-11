import { Info, Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className=" flex items-center justify-center h-screen">
            <div className="text-center flex flex-col items-center justify-center gap-5">
                <Loader2 className="w-24 h-24 text-muted-foreground animate-spin" />
                <h1 className="text-3xl font-bold text-muted-foreground">Loading...</h1>
                <p className=" text-muted-foreground">Please wait while we verify your code.</p>
            </div>
        </div>
    )
}