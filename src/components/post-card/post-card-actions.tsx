import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ShareIcon, MoveIcon, MessageSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PostCardActions() {
    return (
        <div className="flex items-center justify-between mt-4">
            <Button variant={"ghost"} size={"icon"}><MessageSquareIcon className="w-4 h-4" /></Button>
            <Button variant={"ghost"} size={"icon"}><ShareIcon className="w-4 h-4" /></Button>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant={"ghost"} size={"icon"}><MoveIcon className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Save Post</DropdownMenuItem>
                    <DropdownMenuItem>Follow Author</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

    )
}