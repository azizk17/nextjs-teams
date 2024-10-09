"use client"

import { useLibraryStore } from "@/hooks/use-library-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlaylistSelector } from "./_components/list-selector";

export const SelectionWrapper = () => {
    const { selectedItems, clearSelection } = useLibraryStore();

    // Mock playlists data - replace with actual data fetching logic
    const groups = [
        {
            label: "Recent",
            children: [
                {
                    label: "Alicia Koch",
                    value: "alicia-koch",
                },
                {
                    label: "Nina Simone",
                    value: "nina-simone",
                },
                {
                    label: "Jazz",
                    value: "jazz",
                }
            ],
        },
    ]



    if (selectedItems.length === 0) return null;

    return (
        <div className="flex items-center gap-2 bg-secondary rounded-md p-1 text-sm font-semibold mb-4 transition-all duration-300 ease-in-out"
            style={{
                opacity: selectedItems.length > 0 ? 1 : 0,
                maxHeight: selectedItems.length > 0 ? '100px' : '0',
                overflow: 'hidden'
            }}>
            <span>{selectedItems.length} items selected</span>
            <div className="flex items-center gap-2">
                <Button onClick={clearSelection} variant="outline" size="sm">Clear</Button>
                <PlaylistSelector
                    groups={groups}
                    onPlaylistSelect={() => { }}
                    onCreatePlaylist={() => { }}
                />
                <Button variant="outline" size="sm">Download</Button>
                <Button variant="outline" size="sm">Archive</Button>
                <Button variant="outline" size="sm" className="text-destructive">Delete</Button>
            </div>
        </div>
    );
}