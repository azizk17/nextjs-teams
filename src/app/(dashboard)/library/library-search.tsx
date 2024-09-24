"use client";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { searchMediaAction } from "./_actions";
import React from "react";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from '@uidotdev/usehooks'

export function LibrarySearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(query, 500)

    useEffect(() => {
        if (debouncedSearch) {
            handleSearch();
        } else {
            setResults([]);
        }
    }, [debouncedSearch]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await searchMediaAction(debouncedSearch);
            setResults(results.hits);
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                <SearchIcon className="w-4 h-4 mr-2" />
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search for media..."
                    value={query}
                    onValueChange={(value) => setQuery(value)}
                />
                <CommandList>
                    {loading && <CommandEmpty>Loading...</CommandEmpty>}
                    {!loading && query.trim() !== "" && results.length === 0 && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    <CommandSeparator />

                    {Array.isArray(results) && results.length > 0 && (
                        <CommandGroup heading="Search Results">
                            {results.map((result: any) => (
                                <CommandItem key={result.id} value={result.title + " " + result.description + " " + result.id} className=" cursor-pointer">
                                    {result.thumbnailUrl && (
                                        <div className="w-[50px] h-[50px] mr-2 rounded-md overflow-hidden flex-shrink-0">
                                            <Image
                                                src={result.thumbnailUrl}
                                                alt={result.title}
                                                width={50}
                                                height={50}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium">{result.title}</p>
                                        {result.description && (
                                            <p className="text-sm text-muted-foreground">{result.description}</p>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}