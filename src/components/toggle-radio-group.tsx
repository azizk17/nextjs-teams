"use client"
import React from 'react';
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export type ToggleRadioOption = {
    // id: string;
    label: React.ReactNode;
    value: string;
}

export type ToggleRadioGroupProps = {
    name: string;
    options: ToggleRadioOption[];
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export function ToggleRadioGroup({ name, options, defaultValue, onChange, className }: ToggleRadioGroupProps) {
    return (
        <RadioGroup
            name={name}
            defaultValue={defaultValue}
            onValueChange={onChange}
            className={cn("flex flex-wrap gap-2", className)}
        >
            {options.map((option) => (
                <div key={option.value} className="flex items-center">
                    <RadioGroupItem
                        id={option.value}
                        value={option.value}
                        className="peer sr-only"
                    />
                    <Label
                        htmlFor={option.value}
                        className={cn(
                            "cursor-pointer flex items-center space-x-2 rounded-md border-2 p-2",
                            "transition-colors duration-200 ease-in-out",
                            "hover:bg-accent hover:text-accent-foreground",
                            "peer-data-[state=unchecked]:border-muted peer-data-[state=unchecked]:bg-popover peer-data-[state=unchecked]:text-muted-foreground",
                            "peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary peer-data-[state=checked]:text-secondary-foreground"
                        )}
                    >
                        {option.label}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
}