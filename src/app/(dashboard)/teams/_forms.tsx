"use client";

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createTeamAction, updateTeamAction } from './_actions';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

// Define the Zod schema for team creation
const TeamSchema = z.object({
    name: z.string().min(2, { message: 'Team name must be at least 2 characters' }),
    description: z.string().optional(),
});

// CreateTeamForm component for creating a new team.
// -------------------------------------------------------------------------------------------------
export function CreateTeamForm() {
    const [open, setOpen] = useState(false);
    const [state, actions, isPending] = useActionState(createTeamAction, null);

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
                    Create New Team
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Team</DialogTitle>
                </DialogHeader>
                <form action={actions}>
                    <div className="grid gap-4">
                        {JSON.stringify(state)}
                        {state?.success === false && (
                            <div className="text-sm text-destructive">
                                {state.message}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Team Name</Label>
                            <Input id="name" name="name" placeholder="Enter team name" required />
                            {state?.errors?.name && (
                                <span className="text-sm text-destructive">{state.errors.name}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input id="description" name="description" placeholder="Enter team description" />
                            {state?.errors?.description && (
                                <span className="text-sm text-destructive">{state.errors.description}</span>
                            )}
                        </div>
                    </div>
                    <Button type="submit" className="mt-4" disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create Team'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// UpdateTeamForm component for updating an existing team. 
// -------------------------------------------------------------------------------------------------
export function UpdateTeamForm({ team }: { team: { id: string; name: string; description?: string } }) {
    const [open, setOpen] = useState(false);
    const [state, actions, isPending] = useActionState(updateTeamAction, null);

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
                    <PencilIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Team</DialogTitle>
                </DialogHeader>
                <form action={actions}>
                    <input type="hidden" name="id" value={team.id} />
                    <div className="grid gap-4">
                        {state?.success === false && (
                            <div className="text-lg text-destructive">
                                {state.message}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Team Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={team.name}
                                placeholder="Enter team name"
                                required
                            />
                            {state?.errors?.name && (
                                <span className="text-sm text-destructive">{state.errors.name}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                name="description"
                                defaultValue={team.description}
                                placeholder="Enter team description"
                            />
                            {state?.errors?.description && (
                                <span className="text-sm text-destructive">{state.errors.description}</span>
                            )}
                        </div>
                    </div>
                    <Button type="submit" className="mt-4" disabled={isPending}>
                        {isPending ? 'Updating...' : 'Update Team'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// InviteMembersForm component for inviting members to a team.
// -------------------------------------------------------------------------------------------------
export function InviteMembersForm({ team }: { team: { id: string; name: string; description?: string } }) {
    const [open, setOpen] = useState(false);
    const [state, actions, isPending] = useActionState(inviteMembersAction, null);

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
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Members</DialogTitle>
                </DialogHeader>
                <form action={actions}>
                    <input type="hidden" name="teamId" value={team.id} />
                    <div className="grid gap-4">
                        {state?.success === false && (
                            <div className="text-lg text-destructive">
                                {state.message}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="emailOrUsername">Email or Username</Label>
                            <Input
                                id="emailOrUsername"
                                name="emailOrUsername"
                                placeholder="Enter email or @username"
                                required
                            />
                            {state?.errors?.email && (
                                <span className="text-sm text-destructive">{state.errors.email}</span>
                            )}
                        </div>
                    </div>
                    <Button type="submit" className="mt-4" disabled={isPending}>
                        {isPending ? 'Inviting...' : 'Invite Member'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}