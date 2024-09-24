import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PlayIcon, EditIcon, DownloadIcon, ShareIcon, TrashIcon } from "lucide-react"

export const VideoActions = () => {
    return (
        <TooltipProvider delayDuration={0}>
            <div className=" flex items-center justify-between">
                <div className=" flex items-center gap-2">
                    <ActionButton icon={<PlayIcon className="w-4 h-4" />} tooltip="Add to library" onClick={() => { }} />
                    <ActionButton icon={<EditIcon className="w-4 h-4" />} tooltip="Edit" onClick={() => { }} />
                    <ActionButton icon={<DownloadIcon className="w-4 h-4" />} tooltip="Download" onClick={() => { }} />
                    <ActionButton icon={<ShareIcon className="w-4 h-4" />} tooltip="Share" onClick={() => { }} />
                    <ActionButton icon={<TrashIcon className="w-4 h-4" />} tooltip="Delete" onClick={() => { }} />
                </div>
                <div className="flex gap-2 justify-between items-center">
                    <Button variant="secondary" className="flex-grow">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                    <Button variant="secondary" className="flex-grow">
                        <ShareIcon className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="destructive" className="">
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

        </TooltipProvider>
    )
}

export const ActionButton = ({ icon, tooltip, onClick }: { icon: React.ReactNode, tooltip: string, onClick: () => void }) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <Button variant="secondary" size="icon" >
                    {icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {tooltip}
            </TooltipContent>
        </Tooltip>
    )
}