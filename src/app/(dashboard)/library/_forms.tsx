"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GridIcon, LayoutGridIcon, ListIcon, Loader2, MoreVertical, PlusIcon, SaveIcon, Trash2, XIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { deleteMediaAction, importPostAction } from "./_actions";
import { toast } from "sonner";
import { Media } from "@/db/schema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLibraryViewStore } from "@/hooks/use-library-store";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea";

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
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
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

// Import video dialog
// ----------------------------------------------------------------
export function ImportVideoDialog() {
    const [open, setOpen] = React.useState(false);
    const [state, formAction, isPending] = useActionState(importPostAction, null);

    React.useEffect(() => {
        if (state?.success) {
            toast.success("Video import started");
            setOpen(false);
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[600px] w-11/12">
                <AlertDialogHeader>
                    <AlertDialogTitle>Import Video</AlertDialogTitle>
                    <AlertDialogDescription>
                        Choose how you want to import your video.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url">URL Import</TabsTrigger>
                        <TabsTrigger value="upload">File Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url">
                        <form action={formAction} className="space-y-6">
                            <div className="space-y-4">
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
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="playlist">
                                        <AccordionTrigger>Advanced Options</AccordionTrigger>
                                        <AccordionContent className=" flex flex-col gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="playlist">Add to Playlist</Label>
                                                <Select name="playlist">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a playlist" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="new">Create new playlist</SelectItem>
                                                        <SelectItem value="existing">Add to existing playlist</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="playlist">Video Quality</Label>
                                                <Select name="quality">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select quality" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="best">Best Available</SelectItem>
                                                        <SelectItem value="1080p">1080p</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="subtitles" name="subtitles" />
                                                    <Label htmlFor="subtitles">Download subtitles if available</Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="autoThumbnail" name="autoThumbnail" />
                                                    <Label htmlFor="autoThumbnail">Automatically generate thumbnail</Label>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>


                                <AlertDialogFooter>
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
                                </AlertDialogFooter>
                            </div>
                        </form>
                    </TabsContent>
                    <TabsContent value="upload">
                        <form action={formAction} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        type="text"
                                        required
                                        placeholder="Enter video title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Enter video description"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        name="tags"
                                        type="text"
                                        placeholder="Enter tags separated by commas"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select name="language">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            {/* Add more language options as needed */}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select name="category">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="education">Education</SelectItem>
                                            <SelectItem value="entertainment">Entertainment</SelectItem>
                                            <SelectItem value="news">News</SelectItem>
                                            {/* Add more category options as needed */}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create"
                                    )}
                                </Button>
                            </AlertDialogFooter>
                        </form>
                        <form action={formAction} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="file">Video File</Label>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="video/*"
                                        required
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Select a video file to upload.
                                    </p>
                                </div>
                                {/* Add other relevant fields for file upload */}
                            </div>
                            <AlertDialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload"
                                    )}
                                </Button>
                            </AlertDialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// toggle grid view
export function ToggleGridView() {
    const { viewMode, setViewMode } = useLibraryViewStore();
    return (
        <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <ListIcon className="w-4 h-4" /> : <LayoutGridIcon className="w-4 h-4" />}
        </Button>
    )
}