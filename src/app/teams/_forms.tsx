"use client";
import { useRef, useState } from 'react';
import { useActionState } from "react";
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from 'lucide-react';
import { createTeamAction, updateTeamMemberRoleAction } from './_actions';

import { useEffect } from 'react';
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const formSchema = z.object({
    name: z.string().min(2, { message: "Team name must be at least 2 characters." }),
    description: z.string().optional(),
    avatar: z.string().url().optional(),
});



export function CreateTeamForm() {
    const [state, action, isPending] = useActionState(createTeamAction, null);


    useEffect(() => {
        if (state?.success === true) {
            toast.success("Team created successfully!");
        }
    }, [state]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Team
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                </DialogHeader>
                <form action={action}>
                    <div className="grid gap-4">
                        {state?.success === false && (
                            <div className="text-sm text-red-500">
                                {state.message}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Team Name
                            </label>
                            <Input id="name" name="name" placeholder="Enter team name" />
                            {state?.errors?.name && (
                                <p className="text-sm text-red-500">{state.errors.name}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <Textarea id="description" name="description" placeholder="Enter team description" />
                            {state?.errors?.description && (
                                <p className="text-sm text-red-500">{state.errors.description}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="avatar" className="text-sm font-medium">
                                Avatar URL
                            </label>
                            <Input id="avatar" name="avatar" placeholder="Enter avatar URL" />
                            {state?.errors?.avatar && (
                                <p className="text-sm text-red-500">{state.errors.avatar}</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create Team'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// select team member role
export function SelectTeamMemberRoleForm({teamMemberId, teamId, initialRoles}: {teamMemberId: string, teamId: string, initialRoles: string[]}) {
    const [state, action, isPending] = useActionState(updateTeamMemberRoleAction, null);
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(initialRoles);

    useEffect(() => {
        if (state?.success === true) {
            toast.success("Team member roles updated successfully!");
        }
    }, [state]);

    const handleRoleChange = (value: string[]) => {
        setSelectedRoles(value);
        formRef.current?.requestSubmit();
    };

    const roles = [
        { value: "owner", label: "Owner" },
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" }
    ];

    return (
        <form action={action} ref={formRef}>
            <input type="hidden" name="teamMemberId" value={teamMemberId} />
            <input type="hidden" name="teamId" value={teamId} />
            <input type="hidden" name="roles" value={selectedRoles.join(',')} />
            <Select onValueChange={handleRoleChange} defaultValue={selectedRoles} multiple>
                <SelectTrigger disabled={isPending}>
                    <SelectValue placeholder={isPending ? "Loading..." : "Select roles"} />
                </SelectTrigger>
                <SelectContent>
                    {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                            {role.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </form>
    );
}


