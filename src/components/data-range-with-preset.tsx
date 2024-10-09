"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format, isBefore } from "date-fns" // Added isBefore

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DateRange } from "react-day-picker"

export interface DateRangePickerWithPresetsProps {
    name: string;
    onDateRangeChange?: (dateRange: DateRange) => void;
    initialDateRange?: DateRange;
    className?: string;
    placeholder?: string;
    presets?: Array<{ label: string; days: number }>;
}

export function DateRangePickerWithPresets({
    name,
    onDateRangeChange,
    initialDateRange,
    className,
    placeholder = "Select date range",
    presets = [
        { label: "This week", days: 7 },
        { label: "Last 14 days", days: 14 },
    ],
}: DateRangePickerWithPresetsProps) {
    const [dateRange, setDateRange] = React.useState<DateRange>(initialDateRange || { from: undefined, to: undefined });

    React.useEffect(() => {
        if (onDateRangeChange) {
            onDateRangeChange(dateRange);
        }
    }, [dateRange, onDateRangeChange]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                        dateRange.to ? (
                            <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
            >
                <input type="hidden" name={name} value={JSON.stringify(dateRange)} />
                <Select
                    onValueChange={(value) => {
                        const today = new Date();
                        const from = addDays(today, -parseInt(value) + 1);
                        setDateRange({ from, to: today });
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        {presets.map((preset) => (
                            <SelectItem key={preset.label} value={preset.days.toString()}>
                                {preset.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="rounded-md border">
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(newDateRange) => {
                            if (newDateRange?.from && newDateRange?.to && isBefore(newDateRange.to, newDateRange.from)) {
                                setDateRange({ from: newDateRange.to, to: newDateRange.from });
                            } else {
                                setDateRange(newDateRange || { from: undefined, to: undefined });
                            }
                        }}
                        numberOfMonths={2}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
