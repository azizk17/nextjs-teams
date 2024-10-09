import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Checkbox } from "@radix-ui/react-checkbox";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { PlusIcon, Command, SaveIcon, XIcon, Loader2 } from "lucide-react";
import React, { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCollectionAction } from "../_actions";

type Playlist = {
    value: string;
    label: string;
};

type PlaylistGroup = {
    label: string;
    children: Playlist[]
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface PlaylistSelectorProps extends PopoverTriggerProps {
    groups: PlaylistGroup[];
    onPlaylistSelect: (playlist: Playlist) => void;
    onCreatePlaylist: (name: string) => void;
}

// Playlist selector
// ----------------------------------------------------------------
export function PlaylistSelector({ className, groups, onPlaylistSelect, onCreatePlaylist }: PlaylistSelectorProps) {
    // create new action for creating a playlist
    // add to playlist action
    // search playlists
    // recent playlists

    const [open, setOpen] = React.useState(false)
    const [showNewPlaylistDialog, setShowNewPlaylistDialog] = React.useState(false)
    const [selectedPlaylists, setSelectedPlaylists] = React.useState<Playlist[]>([])
    const [newPlaylistName, setNewPlaylistName] = React.useState("")

    const [createCollectionState, createAction, createCollectionIsPending] = useActionState(createCollectionAction, null)

    const handleSelectPlaylist = (playlist: Playlist) => {
        setSelectedPlaylists((prev) => {
            const isSelected = prev.some((p) => p.value === playlist.value)
            if (isSelected) {
                return prev.filter((p) => p.value !== playlist.value)
            } else {
                return [...prev, playlist]
            }
        })
        onPlaylistSelect(selectedPlaylists)
    }

    const handleCreatePlaylist = () => {
        setShowNewPlaylistDialog(true)
    }

    useEffect(() => {
        if (createCollectionState?.success) {
            toast.success("Playlist created")
            setShowNewPlaylistDialog(false)
        }

        if (createCollectionState?.success === false) {
            toast.error("Error creating playlist")
        }
    }, [createCollectionState])

    return (
        <>
            <Dialog open={showNewPlaylistDialog} onOpenChange={setShowNewPlaylistDialog}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            size="sm"
                            aria-expanded={open}
                            aria-label="Select playlists"
                            className={cn(className)}
                        >
                            {selectedPlaylists.length > 0
                                ? `${selectedPlaylists.length} playlist${selectedPlaylists.length > 1 ? 's' : ''} selected`
                                : <><PlusIcon className="w-4 h-4 me-2" /> Add to playlist</>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search playlists..." />
                            <CommandList>
                                <CommandEmpty>No playlist found.</CommandEmpty>
                                {groups.map((group) => (
                                    <CommandGroup key={group.label} heading={group.label}>
                                        {group.children.map((playlist) => (
                                            <CommandItem
                                                key={playlist.value}
                                                className="text-sm flex items-center"
                                                onSelect={() => handleSelectPlaylist(playlist)}
                                            >
                                                <Checkbox
                                                    checked={selectedPlaylists.some((p) => p.value === playlist.value)}
                                                    className="me-2"
                                                />
                                                <span>{playlist.label}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))}
                            </CommandList>
                            <CommandSeparator />
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem className=" !bg-primary !text-primary-foreground hover:!bg-primary/80 hover:!text-primary-foreground cursor-pointer">
                                        <SaveIcon className="w-4 h-4 mr-2" />
                                        Save
                                    </CommandItem>
                                    <CommandItem className=" cursor-pointer">
                                        <XIcon className="w-4 h-4 mr-2" />
                                        Cancel
                                    </CommandItem>
                                    <CommandSeparator />
                                    <DialogTrigger asChild>
                                        <CommandItem
                                            onSelect={() => {
                                                setOpen(false)
                                                setShowNewPlaylistDialog(true)
                                            }}
                                        >
                                            <PlusCircledIcon className="mr-2 h-5 w-5" />
                                            Create Playlist
                                        </CommandItem>
                                    </DialogTrigger>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <DialogContent>
                    <form action={createAction}>
                        <DialogHeader>
                            <DialogTitle>Create playlist</DialogTitle>
                            <DialogDescription>
                                Add a new playlist to organize your media.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2 pb-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Playlist name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="My New Playlist"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowNewPlaylistDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createCollectionIsPending}>
                                {createCollectionIsPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog >
        </>
    )
}