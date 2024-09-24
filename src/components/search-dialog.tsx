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
import { searchMediaAction } from "@/app/(dashboard)/library/_actions";
import React from "react";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from '@uidotdev/usehooks'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const searchMediaAction = async (query: string, index: string) => {
//     const response = await fetch(`/api/search?query=${query}&index=${index}`);
//     return response.json();
// };


export function SearchDialog() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(query, 500)
    const [searchIndex, setSearchIndex] = useState("media");

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
            const results = await searchMediaAction(debouncedSearch, searchIndex);
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
                <div className="flex items-center ">
                    <Select value={searchIndex} onValueChange={setSearchIndex}>
                        <SelectTrigger className="w-[120px] border-none bg-transparent">
                            <SelectValue placeholder="Select index" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="media">Media</SelectItem>
                            <SelectItem value="channels">Channels</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            {/* Add more indexes as needed */}
                        </SelectContent>
                    </Select>
                    <CommandInput
                        placeholder={`Search ${searchIndex}...`}
                        value={query}
                        onValueChange={(value) => setQuery(value)}
                    />
                </div>
                <CommandList>
                    {loading && <CommandEmpty>Loading...</CommandEmpty>}
                    {!loading && query.trim() !== "" && results.length === 0 && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    <CommandSeparator />

                    {Array.isArray(results) && results.length > 0 && (
                        <CommandGroup heading={`${searchIndex.charAt(0).toUpperCase() + searchIndex.slice(1)} Results`}>
                            {results.map((result: any) => (
                                <CommandItem key={result.id} value={result.title + " " + result.description + " " + result.id} className="cursor-pointer">
                                    {searchIndex === "media" && (
                                        <div className="flex items-center">
                                            <div className="w-[50px] h-[50px] mr-2 rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={result.thumbnailUrl}
                                                    alt={result.title}
                                                    width={50}
                                                    height={50}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">{result.title}</p>
                                                <p className="text-sm text-muted-foreground">{result.description}</p>
                                            </div>
                                        </div>
                                    )}
                                    {searchIndex === "channels" && (
                                        <div className="flex items-center">
                                            <div className="w-[40px] h-[40px] mr-2 rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={result.avatarUrl || "/default-channel-avatar.png"}
                                                    alt={result.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">{result.name}</p>
                                                <p className="text-sm text-muted-foreground">{result.subscriberCount} subscribers</p>
                                            </div>
                                        </div>
                                    )}
                                    {searchIndex === "users" && (
                                        <div className="flex items-center">
                                            <div className="w-[40px] h-[40px] mr-2 rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={result.avatarUrl || "/default-user-avatar.png"}
                                                    alt={result.username}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">{result.username}</p>
                                                <p className="text-sm text-muted-foreground">{result.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}