"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import qs from "qs"
import { useActionState, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { z } from "zod"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CheckIcon, ChevronDown, Command, FilterIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Icon } from "@/components/Icons"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CommandGroup, CommandInput, CommandItem, CommandEmpty, CommandList } from "@/components/ui/command"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { MultiSelect } from "@/components/multi-select"
import { ToggleCheckbox } from "@/components/toggle-checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ToggleRadioGroup } from "@/components/toggle-radio-group"
type FilterFormProps = {
};
// Helper function to build query string
export const buildQueryString = (params: Record<string, string | string[] | undefined>) => {
    // Remove empty keys
    // Remove empty, null, or undefined keys
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== null && value !== ''
        )
    );


    // Use qs to stringify with array format for comma separated values
    return qs.stringify(filteredParams, { arrayFormat: 'comma' });
};

const filterFormSchema = z.object({
    title: z.string().optional(),
    platforms: z.array(z.string()).optional(),
    author: z.string().optional(),
    publishedAt: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }).optional(),
    language: z.string().optional(),
    popularity: z.number().optional(),
    languages: z.array(z.string()).optional(),
});

const useInitialFilters = () => {
    const searchParams = useSearchParams();
    return {
        title: searchParams.get('title') || undefined,
        platforms: searchParams.get('platforms')?.split(',') || undefined,
        author: searchParams.get('author') || undefined,
        publishedAt: {
            from: searchParams.get('publishedFrom') ? new Date(searchParams.get('publishedFrom')!) : undefined,
            to: searchParams.get('publishedTo') ? new Date(searchParams.get('publishedTo')!) : undefined,
        },
        language: searchParams.get('language') || undefined,
        popularity: searchParams.get('popularity') ? Number(searchParams.get('popularity')) : undefined,
        languages: searchParams.get('languages')?.split(',') || undefined,
    };
};

export function FilterForm({ }: FilterFormProps) {
    const router = useRouter()
    const initialFilters = useInitialFilters()
    const [openLanguages, setOpenLanguages] = useState(false)
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        initialFilters.languages || []
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = filterFormSchema.safeParse({
            title: formData.get('title') as string || undefined,
            platforms: formData.getAll('platform') as string[] || undefined,
            author: formData.get('author') as string || undefined,
            publishedAt: {
                from: formData.get('publishedFrom') ? new Date(formData.get('publishedFrom') as string) : undefined,
                to: formData.get('publishedTo') ? new Date(formData.get('publishedTo') as string) : undefined,
            },
            language: formData.get('language') as string || undefined,
            popularity: formData.get('popularity') ? Number(formData.get('popularity')) : undefined,
            languages: formData.getAll('languages') as string[] || undefined,
        });
        if (!params.success) {
            console.error(params.error)
            return
        }
        console.log("dataa", params.data)
        router.push(`/library?${buildQueryString(params.data)}`);
    };

    const hasFilters = Object.values(initialFilters).some(value => value !== undefined);

    const platforms = [
        { name: "Twitter", value: "twitter" },
        { name: "YouTube", value: "youtube" },
        { name: "Vimeo", value: "vimeo" },
    ]

    const PlatformCheckbox = ({ platform, initialFilters }: { platform: { name: string, value: string }, initialFilters: Record<string, string | string[] | undefined> }) => {
        return (
            <div key={platform.value} className="flex items-center">
                <Checkbox
                    id={`platform-${platform.value}`}
                    name="platform"
                    value={platform.value}
                    className="peer sr-only"
                    defaultChecked={initialFilters.platforms?.includes(platform.value)}
                />
                <Label
                    htmlFor={`platform-${platform.value}`}
                    className="cursor-pointer flex items-center space-x-2 rounded-md
                     border-2 border-muted bg-popover p-2 text-muted-foreground 
                     hover:bg-accent hover:text-accent-foreground 
                     peer-data-[state=checked]:border-primary 
                     [&:has([data-state=checked])]:border-primary 
    
                     peer-data-[state=checked]:text-green-500"
                >
                    <Icon name={platform.value} className="w-4 h-4" />
                    <span>{platform.name}</span>
                </Label>
            </div>
        );
    };

    const languages = [
        { label: "English", value: "en" },
        { label: "Spanish", value: "es" },
        { label: "French", value: "fr" },
        // Add more languages as needed
    ];

    const sortOptions = [
        { label: "Popularity", value: "popularity" },
        { label: "Published Date", value: "publishedAt" },
        { label: "Title", value: "title" },
    ];
    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="outline" size="icon">
                    <FilterIcon className={`w-4 h-4 ${hasFilters ? 'text-green-500' : ''}`} />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                        Refine your search results by applying filters.
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                    <div className=" flex flex-col space-y-2">
                        <Input
                            name="title"
                            placeholder="Search by title"
                            defaultValue={initialFilters.title}
                            className="flex-grow"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Platforms</label>
                        <div className="flex flex-wrap gap-2">
                            {platforms.map((platform) => (
                                <ToggleCheckbox
                                    key={platform.value}
                                    id={`platform-${platform.value}`}
                                    name="platform"
                                    value={platform.value}
                                    defaultChecked={initialFilters.platforms?.includes(platform.value)}
                                >
                                    <Icon name={platform.value} className="w-4 h-4" />
                                    <span>{platform.name}</span>
                                </ToggleCheckbox>
                            ))}
                        </div>
                    </div>
                    <Input
                        name="author"
                        placeholder="Filter by author"
                        defaultValue={initialFilters.author}
                    />
                    <div className="flex flex-col gap-2">
                        <Label>Published Date Range</Label>
                        <DatePickerWithRange
                            name="publishedAt"
                            defaultValue={initialFilters.publishedAt}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Language</Label>
                        <MultiSelect items={languages}
                            selected={initialFilters?.languages}
                            name="languages"
                            onSelect={setSelectedLanguages}
                            placeholder="Select languages"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Popularity</Label>
                        <Slider
                            name="popularity"
                            defaultValue={[initialFilters.popularity || 0]}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Sort by</Label>
                        <ToggleRadioGroup options={sortOptions} name="sort" />

                    </div>
                    <Button type="submit" className="w-full">Apply Filters</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
