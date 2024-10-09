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
import { AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, AudioLines, AudioLinesIcon, CheckIcon, ChevronDown, Command, FileAudioIcon, FileIcon, FilterIcon, GalleryHorizontalIcon, GalleryVerticalIcon, ImageIcon, RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon, VideoIcon } from "lucide-react"
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
import { ToggleRadioGroup } from "@/components/toggle-radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DateRangePickerWithPresets, DateRangePickerWithPresetsProps } from "@/components/data-range-with-preset"
import { toast } from "sonner"

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
    minLength: z.number().min(0).optional(),
    maxLength: z.number().optional(),
    orientation: z.enum(['vertical', 'horizontal', 'square']).optional(),
    uploadDate: z.enum(['lastHour', 'today', 'thisWeek', 'thisMonth', 'thisYear']).optional(),
    contentTypes: z.array(z.enum(['video', 'image', 'audio', 'document'])).optional(),
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
        minLength: searchParams.get('minLength') ? Number(searchParams.get('minLength')) : undefined,
        maxLength: searchParams.get('maxLength') ? Number(searchParams.get('maxLength')) : undefined,
        orientation: searchParams.get('orientation') as 'vertical' | 'horizontal' | 'square' | undefined,
        contentTypes: searchParams.getAll('contentTypes') as Array<'video' | 'image' | 'audio' | 'document'>,
        countries: searchParams.get('countries')?.split(',') || undefined,
    };
};

export function FilterForm({ }: FilterFormProps) {
    const router = useRouter()
    const initialFilters = useInitialFilters()
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        initialFilters.languages || []
    );
    const [selectedCountries, setSelectedCountries] = useState<string[]>(
        initialFilters.countries || []
    );
    const [lengthRange, setLengthRange] = useState<number[]>([
        initialFilters.minLength || 0,
        initialFilters.maxLength || 100
    ]);

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
            minLength: formData.get('minLength') ? Number(formData.get('minLength')) : undefined,
            maxLength: formData.get('maxLength') ? Number(formData.get('maxLength')) : undefined,
            contentTypes: formData.getAll('contentTypes') as Array<'video' | 'image' | 'audio' | 'document'>,
            countries: formData.getAll('countries') as string[] || undefined,
        });

        if (!params.success) {
            console.error(params.error)
            toast.error("Error applying filters")
            return
        }
        router.push(`/library?${buildQueryString(params.data)}`);
    };

    const hasFilters = Object.values(initialFilters).some(value => value !== undefined);

    const platforms = [
        { name: "Twitter", value: "twitter" },
        { name: "YouTube", value: "youtube" },
        { name: "Vimeo", value: "vimeo" },
    ]


    const languages = [
        { label: "English", value: "en-US" },
        { label: "Arabic", value: "ar-SA" },
        { label: "Arabic", value: "ar-EG" },
        { label: "Spanish", value: "es-ES" },
        { label: "French", value: "fr-FR" },
        { label: "Portuguese", value: "pt-BR" },
        { label: "Italian", value: "it-IT" },
        { label: "German", value: "de-DE" },
        { label: "Russian", value: "ru-RU" },
        { label: "Turkish", value: "tr-TR" },
        { label: "Dutch", value: "nl-NL" },
        { label: "Polish", value: "pl-PL" },
        // Add more languages as needed
    ];

    // add country
    const countries = [
        { label: "United States", value: "US" },
        { label: "United Kingdom", value: "UK" },
        { label: "Canada", value: "CA" },
        { label: "Australia", value: "AU" },
        { label: "Germany", value: "DE" },
        { label: "France", value: "FR" },
        { label: "Japan", value: "JP" },
    ];

    const sortOptions = [
        { label: "Popularity", value: "popularity" },
        { label: "Published Date", value: "publishedAt" },
        { label: "Title", value: "title" },
        { label: "Platform", value: "platform" },
    ];

    const getLengthLabel = (value: number) => {
        if (value <= 25) return "Short";
        if (value <= 50) return "Medium";
        if (value <= 75) return "Long";
        return "Very Long";
    };

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="outline" size="icon">
                    <FilterIcon className={`w-4 h-4 ${hasFilters ? 'text-green-500' : ''}`} />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full min-w-[600px]">
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
                        placeholder="Filter by username, name, external ID"
                        defaultValue={initialFilters.author}
                    />
                    <div className="flex flex-col gap-2">
                        <Label>Published Date Range</Label>
                        <DateRangePickerWithPresets
                            initialDateRange={initialFilters.publishedAt}
                            name="publishedRange"
                            presets={[
                                { label: "Today", days: 1 },
                                { label: "This week", days: 7 },
                                { label: "This month", days: 30 },
                                { label: "This year", days: 365 },
                            ]}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Language</Label>
                        <MultiSelect
                            options={languages}
                            defaultValue={initialFilters.languages}
                            name="languages"
                            placeholder="Select languages"
                            onValueChange={setSelectedLanguages}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Country</Label>
                        <MultiSelect
                            options={countries}
                            defaultValue={initialFilters.countries}
                            name="countries"
                            placeholder="Select countries"
                            onValueChange={setSelectedCountries}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Popularity</Label>
                        <ToggleRadioGroup
                            allowToggle={true}
                            options={[
                                { label: "Popular", value: "1" },
                                { label: "Very Popular", value: "2" },
                                { label: "Trending", value: "3" },
                            ]}
                            name="popularity"
                            defaultValue={initialFilters.popularity?.toString()}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Sort by</Label>
                        <ToggleRadioGroup allowToggle={true} options={sortOptions} name="sort" />

                    </div>
                    <div className="space-y-4">
                        <Label>Content Length</Label>
                        <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={lengthRange}
                            onValueChange={setLengthRange}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{getLengthLabel(lengthRange[0])}</span>
                            <span>{getLengthLabel(lengthRange[1])}</span>
                        </div>
                        <input type="hidden" name="minLength" value={lengthRange[0]} />
                        <input type="hidden" name="maxLength" value={lengthRange[1]} />
                    </div>
                    <div className="space-y-2">
                        <Label>Orientation</Label>
                        <ToggleRadioGroup
                            name="orientation"
                            defaultValue={initialFilters.orientation}
                            allowToggle={true}
                            options={[
                                {
                                    value: "vertical",
                                    label: <GalleryHorizontalIcon className="h-6 w-6" />,
                                },
                                {
                                    value: "horizontal",
                                    label: <GalleryVerticalIcon className="h-6 w-6" />,
                                },
                            ]}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Content Type</Label>
                        <div className="flex flex-wrap gap-2 items-center">
                            {[
                                { type: 'video', icon: <VideoIcon className="w-4 h-4" /> },
                                { type: 'image', icon: <ImageIcon className="w-4 h-4" /> },
                                { type: 'audio', icon: <AudioLinesIcon className="w-4 h-4" /> },
                                { type: 'document', icon: <FileIcon className="w-4 h-4" /> }
                            ].map(({ type, icon }) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <ToggleCheckbox
                                        id={`content-type-${type}`}
                                        name="contentTypes"
                                        value={type}
                                        defaultChecked={initialFilters.contentTypes?.includes(type)}
                                    >
                                        {icon}
                                        <span className="capitalize">{type}</span>
                                    </ToggleCheckbox>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end gap-2">
                        <Button type="submit" variant="default">Apply Filters</Button>
                        <Button type="reset" variant="outline">Reset</Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}