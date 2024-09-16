"use client";

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createProjectAction } from './_actions';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

// Define the Zod schema for project creation
const ProjectSchema = z.object({
    name: z.string().min(2, { message: 'Project name must be at least 2 characters' }),
    description: z.string().optional(),
});

export function CreateProjectForm() {
    const [open, setOpen] = useState(false);
    const [state, actions, isPending] = useActionState(createProjectAction, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            setOpen(false);
        }
        if (state?.success === false) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Project</DialogTitle>
                </DialogHeader>
                <form action={actions}>
                    <div className="grid gap-4">
                        {state?.success === false && (
                            <div className="text-sm text-destructive">
                                {state.message}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input id="name" name="name" placeholder="Enter project name" required />
                            {state?.errors?.name && (
                                <span className="text-sm text-destructive">{state.errors.name}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input id="description" name="description" placeholder="Enter project description" />
                            {state?.errors?.description && (
                                <span className="text-sm text-destructive">{state.errors.description}</span>
                            )}
                        </div>
                    </div>
                    <Button type="submit" className="mt-4" disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create Project'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
