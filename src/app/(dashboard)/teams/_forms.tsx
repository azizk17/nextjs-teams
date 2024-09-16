"use client";

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createTeamAction, deleteTeamAction, inviteMembersAction, toggleTeamStatusAction, updateTeamAction } from './_actions';
import { CircleCheckIcon, CircleXIcon, Loader2, PauseCircleIcon, PencilIcon, PlayCircleIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

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
                <Button variant="outline" size="icon">
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
export function InviteMembersForm({ team, trigger }: { team: { id: string; name: string; description?: string }, trigger: React.ReactNode }) {
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

    const roles = [
        { value: 'Owner', label: 'Owner' },
        { value: 'Publisher', label: 'Publisher' },
        { value: 'Editor', label: 'Editor' },
        { value: 'Creator', label: 'Creator' },
        { value: 'Moderator', label: 'Moderator' },
        { value: 'Analyst', label: 'Analyst' },
        { value: 'Viewer', label: 'Viewer' }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Members</DialogTitle>
                </DialogHeader>
                <form action={actions}>
                    <input type="hidden" name="teamId" value={team.id} />
                    <div className="flex flex-col gap-4">
                        {state?.success === false && (
                            <div className="text-lg text-destructive">
                                {state.message}
                            </div>
                        )}
                        <div className="flex gap-4">
                            <div className="flex-grow">
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
                            <div className="w-1/3">
                                <Label htmlFor="role">Role</Label>
                                <Select name="role">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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

// ToggleTeamStatusForm component for toggling the status of a team.
// -------------------------------------------------------------------------------------------------
export function ToggleTeamStatusForm({ team, trigger }: { team: { id: string; disabled: boolean }, trigger: React.ReactNode }) {
    const [state, actions, isPending] = useActionState(toggleTeamStatusAction, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        }
        if (state?.success === false) {
            toast.error(state.message);
        }
        console.log(state);
    }, [state]);

    return (
        <form action={actions}>
            <input type="hidden" name="id" value={team.id} />
            <Button type="submit" variant={!team.disabled ? "outline" : "default"} size="sm" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : team.disabled ? <PlayCircleIcon className="w-4 h-4 mr-2" /> : <PauseCircleIcon className="w-4 h-4 mr-2" />}
                {team.disabled ? 'Activate Team' : 'Deactivate Team'}
            </Button>
        </form>
    );
}

// DeleteTeamForm component for deleting a team.
// -------------------------------------------------------------------------------------------------
export function DeleteTeamForm({ team, trigger }: { team: { id: string; }, trigger: React.ReactNode }) {
    const [state, actions, isPending] = useActionState(deleteTeamAction, null);
    const router = useRouter();
    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        }
        console.log(state);
    }, [state]);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isPending}>
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrashIcon className="w-4 h-4 mr-2" />}
                    Delete Team
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the team
                        and remove all associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form action={actions}>
                        <input type="hidden" name="id" value={team.id} />
                        <AlertDialogAction asChild className=' bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                            <Button type="submit" disabled={isPending}>
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete Team
                            </Button>
                        </AlertDialogAction>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

