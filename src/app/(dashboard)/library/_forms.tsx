"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, PlusIcon, SaveIcon, Trash2, XIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { deleteMediaAction, importVideoAction } from "./_actions";
import { toast } from "sonner";
import { Media } from "@/db/schema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import * as React from "react"
import {
    CaretSortIcon,
    CheckIcon,
    PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox";
import { createCollectionAction } from "./_actions";
import { AddToCollection } from "@/components/add-to-collection";


export function CardActions({ item }: { item: Media }) {
    const [open, setOpen] = useState(false);
    const [deleteState, deleteAction, deleteIsPending] = useActionState(deleteMediaAction, null)


    // recent collections
    // search collections
    // create collection
    // toggle collection
    // get collections by media id


    useEffect(() => {
        if (deleteState?.success) {
            toast.success("Media deleted")
        }

        if (deleteState?.success === false) {
            toast.error("Error deleting media")
        }
    }, [deleteState])

    const labels = ['Personal', 'Work', 'Important', 'Optional']
    const [label, setLabel] = useState<string | null>(null)
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add to collection
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="p-0">
                            <AddToCollection itemId={item.id} />
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    {/* <AddToCollection itemId={item.id} /> */}

                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        disabled={deleteIsPending}
                        onClick={() => {
                            startTransition(() => {
                                deleteAction(item.id)
                            })
                        }}>
                        {deleteIsPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}

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

// Import video dialog
// ----------------------------------------------------------------
export function ImportVideoDialog() {
    const [open, setOpen] = React.useState(false);
    const [state, formAction, isPending] = useActionState(importVideoAction, null);

    React.useEffect(() => {
        if (state?.success) {
            toast.success("Video import started");
            setOpen(false);
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Import Video
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Video</DialogTitle>
                    <DialogDescription>
                        Enter the URL of the video you want to import and set import options.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">Video URL</Label>
                        <Input
                            id="url"
                            name="url"
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            Enter the URL of the video you want to import.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Custom Title (Optional)</Label>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="My Awesome Video"
                        />
                        <p className="text-sm text-muted-foreground">
                            Leave blank to use the original video title.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="playlist">Add to Playlist</Label>
                        <Select name="playlist">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a playlist" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="playlist1">Playlist 1</SelectItem>
                                <SelectItem value="playlist2">Playlist 2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quality">Video Quality</Label>
                        <Select name="quality" defaultValue="best">
                            <SelectTrigger>
                                <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="best">Best Available</SelectItem>
                                <SelectItem value="1080p">1080p</SelectItem>
                                <SelectItem value="720p">720p</SelectItem>
                                <SelectItem value="480p">480p</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="subtitles" name="subtitles" />
                        <Label htmlFor="subtitles">Download subtitles if available</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="autoThumbnail" name="autoThumbnail" />
                        <Label htmlFor="autoThumbnail">Automatically generate thumbnail</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                "Import"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

