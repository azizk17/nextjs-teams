"use client"

import { Icon } from "@/components/Icons";
import { CheckIcon, PlayIcon, PlusIcon, User2 } from "lucide-react";
import Link from "next/link";
import { CardActions } from "./_forms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Media } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { useLibraryStore } from "@/hooks/use-library-store";
import React from "react";


type PostCardProps = {
    item: Media & {
        platform: {
            id: string;
            name: string;
        };
        author: {
            id: string;
            name: string;
        };
    };
};

export const PostCard = ({ item }: PostCardProps) => {
    const { selectedItems, toggleItem } = useLibraryStore();
    const isSelected = selectedItems.includes(item.id);

    return (
        <div className={`border bg-background rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 ${isSelected ? 'ring ring-offset-2 ring-green-500 ' : ''}`}>
            <div className="absolute top-2 left-2 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full"
                    onClick={() => toggleItem(item.id)}
                >
                    {isSelected ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                </Button>
            </div>
            <div className="relative pb-[56.25%] group">
                <Link href={`/library/${item.id}`}>
                    <Image
                        src={item.thumbnailUrl ?? ""}
                        alt={item.title}
                        fill
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                    />
                    <div className="absolute top-2 right-2">
                        <Icon name={item.platform.name.toLowerCase()} className="text-white bg-black bg-opacity-50 rounded-full p-1" size={30} />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                        <PlayIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={48} />
                    </div>
                </Link>
            </div>
            <div className="p-2">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="font-semibold text-primary line-clamp-2 flex-1 mr-2">
                        <Link href={`/library/${item.id}`} className="hover:text-primary/70">
                            {item.title}
                        </Link>
                    </h2>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <CardActions item={item} />
                    </React.Suspense>
                </div>
                {/* <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {item.content?.description}
                </p> */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-2">
                            <AvatarImage src={item.author?.avatarUrl} alt={item.author?.name} />
                            <AvatarFallback>
                                <User2 className="w-4 h-4" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                            {item.author.name}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {item.publishedAt ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true }) : 'N/A'}
                    </span>
                </div>
            </div>
        </div >
    );
};