"use client"

import * as React from "react"
import { CheckIcon, Loader2, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { addMediaToCollectionAction, createCollectionAction, getCollectionsByMediaIdAction, getRecentCollectionsAction, searchForCollection, toggleCollectionAction } from "@/app/(dashboard)/library/_actions"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Collection } from "@/db/schema"
import { Checkbox } from "@/components/ui/checkbox"
import { useDebounce } from '@uidotdev/usehooks'
import { useLibraryStore } from "@/hooks/use-library-store"
import { startTransition, useActionState, useEffect, useState } from "react"
import { cn } from "@/lib/utils"


export function AddToCollection({ itemId }: { itemId?: string }) {
    const [recentCollections, setRecentCollections] = useState<Collection[]>([])
    const [open, setOpen] = useState(false)
    const [createCollectionState, createAction, createCollectionIsPending] = useActionState(createCollectionAction, null)
    const [addMediaToCollectionState, addMediaToCollection, addMediaToCollectionIsPending] = useActionState(toggleCollectionAction, null)
    const [searchCollectionsState, searchCollections, searchCollectionsIsPending] = useActionState(searchForCollection, null)
    const [mediaInCollections, setMediaInCollections] = useState<Collection[]>([])
    const { selectedItems, clearSelection } = useLibraryStore();
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);


    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    const handleOnCollectionSelect = (collectionId: string) => {
        setSelectedCollectionId(collectionId)
        const formData = new FormData()
        if (itemId) {
            formData.append("mediaId", itemId)
        }
        formData.append("collectionId", collectionId)
        startTransition(() => {
            addMediaToCollection(formData)
        })
    }
    const handleOnCreateCollection = (collectionName: string) => {
        const formData = new FormData()
        formData.append("name", collectionName)
        startTransition(() => {
            createAction(formData)
        })
    }

    // Transform collections to label-value pairs
    const _collectionsOpts = (collections: Collection[]) => {
        if (!collections) return []
        return collections.map(collection => ({
            label: collection.name,
            value: collection.id
        }))
    }

    // Get recent collections 
    useEffect(() => {
        const fetchData = async () => {
            const recentCollections = await getRecentCollectionsAction({ limit: 3 })
            setRecentCollections(recentCollections.data)
            const collections = await getCollectionsByMediaIdAction({ mediaId: itemId ?? "" })
            setMediaInCollections(collections.data)
        }
        fetchData()
    }, [itemId])

    const isMediaInCollection = (collectionId: string) => mediaInCollections?.some(collection => collection.id === collectionId)

    // Create collection
    useEffect(() => {
        if (createCollectionState?.success) {
            setSearchQuery("")
            setRecentCollections(prevCollections => [createCollectionState.data.collection, ...prevCollections])
            toast.success(createCollectionState.message)
        }
        if (createCollectionState?.success === false) {
            toast.error(createCollectionState.message)
        }
    }, [createCollectionState])

    // Search collections
    useEffect(() => {
        if (debouncedSearchQuery && debouncedSearchQuery.length >= 3) {
            const formData = new FormData()
            formData.append("query", debouncedSearchQuery)
            startTransition(() => {
                searchCollections(formData)
            })
        }
    }, [debouncedSearchQuery])

    // Add media to collection
    useEffect(() => {
        if (addMediaToCollectionState?.success) {
            toast.success(addMediaToCollectionState.message)
            setSelectedCollectionId(null)
            if (!mediaInCollections) {
                setMediaInCollections([addMediaToCollectionState.data])
            }
            if (addMediaToCollectionState.data.added) {
                setMediaInCollections(prevCollections => [...prevCollections, addMediaToCollectionState.data])
            } else {
                setMediaInCollections(prevCollections =>
                    prevCollections.filter(collection => collection.id !== addMediaToCollectionState.data.id)
                )
            }
        }
        if (addMediaToCollectionState?.success === false) {
            toast.error(addMediaToCollectionState.message)
        }
    }, [addMediaToCollectionState])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Command>
                <CommandInput
                    placeholder="Search collection..."
                    onValueChange={(value) => setSearchQuery(value)}
                    value={searchQuery}
                />
                <CommandList>
                    {searchCollectionsState?.data && searchQuery.length > 2 ? (
                        <CommandGroup>
                            {_collectionsOpts(searchCollectionsState?.data).map((item: any) => (
                                <CommandItem
                                    key={`search-${item.value}`}
                                    value={item.label + " " + item.value}
                                    onSelect={() => handleOnCollectionSelect(item.value)}
                                    className="line-clamp-2 text-sm flex items-center cursor-pointer"
                                >
                                    {addMediaToCollectionIsPending && item.value === selectedCollectionId && <Loader2 className="mr-2 text-muted-foreground w-4 h-4 animate-spin" />}
                                    {isMediaInCollection(item.value)
                                        ? <CheckIcon className="mr-2 text-green-500 w-4 h-4" />
                                        : <PlusIcon className="mr-2 text-muted-foreground w-4 h-4" />}
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : (
                        <CommandGroup heading="Recent">
                            {_collectionsOpts(recentCollections).map((item) => (
                                <CommandItem
                                    key={`recent-${item.value}`}
                                    value={item.label + " " + item.value}
                                    onSelect={() => handleOnCollectionSelect(item.value)}
                                    className="line-clamp-2 text-sm flex items-center"
                                >
                                    {
                                        addMediaToCollectionIsPending && item.value === selectedCollectionId
                                            ? <Loader2 className="mr-2 text-muted-foreground w-4 h-4 animate-spin" />
                                            : <Checkbox checked={isMediaInCollection(item.value)} disabled={addMediaToCollectionIsPending} className="me-2" />
                                    }
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    <CommandSeparator />
                    <CommandItemCreate
                        inputValue={searchQuery}
                        items={[..._collectionsOpts(recentCollections), ..._collectionsOpts(searchCollectionsState?.data)]}
                        onSelect={() => handleOnCreateCollection(searchQuery)}
                    />
                </CommandList>
            </Command>
        </Dialog>

    )
}

const CommandItemCreate = ({
    inputValue,
    items,
    onSelect,
}: {
    inputValue: string;
    items: { label: string; value: string }[];
    onSelect: () => void;
}) => {

    if (!inputValue) return null
    if (inputValue.length < 3) return null
    if (!items || items?.length === 0) return null
    console.log(items)
    const trimmedInput = inputValue.trim().toLowerCase();

    const hasNoCollection = !items
        .map(({ value }) => value)
        .includes(trimmedInput);

    const hasNoCollection2 = !items.some(({ label }) =>
        label.trim().toLowerCase() === trimmedInput
    );

    const render = trimmedInput !== "" && hasNoCollection2;

    if (!render) return null;

    // BUG: whenever a space is appended, the Create-Button will not be shown.
    return (
        <CommandItem
            key={`${inputValue}`}
            value={`${trimmedInput}`}
            className="text-xs text-muted-foreground cursor-pointer"
            onSelect={onSelect}
        >
            <PlusIcon className="me-2 h-4 w-4" />
            Create new &quot;{trimmedInput}&quot;
        </CommandItem>
    );
};