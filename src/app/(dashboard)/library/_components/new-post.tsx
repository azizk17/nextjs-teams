"use client"

import { AlertDialog, AlertDialogHeader, AlertDialogContent, AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActionState, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"
import { toast } from "sonner"
import { createPostAction, importPostAction } from "../_actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// New post dialog
// ----------------------------------------------------------------
export function NewPostDialog() {
    const [open, setOpen] = useState(false)

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[800px] w-11/12">
                {/* <AlertDialogHeader>
                    <AlertDialogTitle>New Post</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Choose how you want to create your post.
                </AlertDialogDescription> */}
                <Tabs defaultValue="import" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="import">Import Post</TabsTrigger>
                        <TabsTrigger value="create">Create Post</TabsTrigger>
                    </TabsList>
                    <TabsContent value="import">
                        <ImportPostForm setOpen={setOpen} />
                    </TabsContent>
                    <TabsContent value="create">
                        <NewPostForm setOpen={setOpen} />
                    </TabsContent>
                </Tabs>
            </AlertDialogContent>
        </AlertDialog>
    )
}

// New post form
// ----------------------------------------------------------------
export function NewPostForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const [state, formAction, isPending] = useActionState(createPostAction, null);
    React.useEffect(() => {
        if (state?.success) {
            toast.success("Post created successfully");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);
    return (
        <form action={formAction} className="space-y-6">

            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="My Awesome Post"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    name="description"
                    type="text"
                    placeholder="My Awesome Post"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                    id="tags"
                    name="tags"
                    type="text"
                    placeholder="My Awesome Post"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    required
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isPending}>
                    Create Post
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}

// Import post form
// ----------------------------------------------------------------
export function ImportPostForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const [state, formAction, isPending] = useActionState(importPostAction, null);

    React.useEffect(() => {
        if (state?.success) {
            toast.success("Post import started");
            setOpen(false);
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);
    return (
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
                        Enter the URL of the post you want to import.
                    </p>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isPending}>
                    Import Post
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}