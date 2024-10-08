"use client"
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export type ToggleCheckboxProps = {
    id: string;
    name: string;
    value?: string;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    children: React.ReactNode;
    className?: string;
}
export function ToggleCheckbox({ id, name, value, defaultChecked, onChange, children, className }: ToggleCheckboxProps) {

    return (
        <div className={cn("flex items-center", className)}>
            <Checkbox
                id={id}
                name={name}
                value={value}
                className="peer sr-only"
                defaultChecked={defaultChecked}
                onCheckedChange={onChange}
            />
            <Label
                htmlFor={id}
                className={cn(
                    "cursor-pointer flex items-center space-x-2 rounded-md border-2 p-2",
                    "transition-colors duration-200 ease-in-out",
                    "hover:bg-accent hover:text-accent-foreground",
                    "peer-data-[state=unchecked]:border-muted peer-data-[state=unchecked]:bg-popover peer-data-[state=unchecked]:text-muted-foreground",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-secondary"
                )}
            >
                {children}
            </Label>
        </div>
    )
}