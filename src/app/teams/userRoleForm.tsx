"use client"
import React, { useActionState, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from 'sonner';

const UserRolesManager = ({ roles = [], initialRoles = [], formAction = null }) => {
    const [open, setOpen] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState(initialRoles)
    
    const [state, action, isPending] = useActionState(formAction, null)

    const toggleRole = (role) => {
        const newSelectedRoles = selectedRoles.some(r => r.id === role.id)
            ? selectedRoles.filter((r) => r.id !== role.id)
            : [...selectedRoles, role]
        setSelectedRoles(newSelectedRoles)
        const formData = new FormData()
        formData.set("roles", JSON.stringify(newSelectedRoles))
        action(formData)

    }

    const getPlaceholderText = () => {
        if (selectedRoles.length === 0) return "Select roles..."
        return selectedRoles.map(role => role?.name).join(", ")
    }

    const isRoleSelected = (role) => {
        return selectedRoles.some(r => r.id === role.id)
    }

    useEffect(() => {
        if (state?.success === true) {
            toast.success("Team member roles updated successfully!");
        }
        if (state?.success === false) {
            toast.error("Failed to update team member roles!");
        }
    }, [state]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {getPlaceholderText()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2 p-2">
                        <Checkbox
                            id={role.id}
                            checked={isRoleSelected(role)}
                            onCheckedChange={() => toggleRole(role)}
                            disabled={isPending}
                            className="data-[disabled]:opacity-10 data-[disabled]:cursor-not-allowed"
                            
                        />
                        {String(isPending)}
                        <label htmlFor={role.id} className="flex-grow cursor-pointer">
                            {role.name} {isPending ? "..." : ""}
                        </label>
                        {/* {isRoleSelected(role) && (
                            <Check className="h-4 w-4 text-primary" />
                        )} */}
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    )
}

export default UserRolesManager;