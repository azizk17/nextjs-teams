import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { getAllMedia, getMediaCount } from "@/services/mediaService";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/pagination";
import { Media } from "@/db/schema/mediaSchema";
import { Icon } from "@/components/Icons";
import { FaYoutube } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, PlayIcon, PlusIcon, SearchIcon, User2 } from "lucide-react";
import { FilterForm } from "./_filters";
import { LibrarySearch } from "./library-search-new";
import { ImportVideoDialog } from "./_forms";
import { format, formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CardActions } from "./_forms";
import { PostCard } from "./post-card";
import { SelectionWrapper } from "./selection-wrapper";
import { TagBar } from "@/components/tag-bar";

export default async function LibraryPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const page = +(searchParams.page ?? 1);
    const limit = +(searchParams.limit ?? 20);

    const data = await getAllMedia({ page, limit });
    const count = await getMediaCount();
    const tags = [
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Videos',
            value: 'videos',
        },
        {
            label: 'Images',
            value: 'images',
        },
        {
            label: 'Audio',
            value: 'audio',
        },
        {
            label: 'Documents',
            value: 'documents',
        },
        {
            label: 'Other',
            value: 'other',
        },
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Videos',
            value: 'videos',
        },
        {
            label: 'Images',
            value: 'images',
        },
        {
            label: 'Audio',
            value: 'audio',
        },
        {
            label: 'Documents',
            value: 'documents',
        },
        {
            label: 'Other',
            value: 'other',
        },
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Videos',
            value: 'videos',
        },
        {
            label: 'Images',
            value: 'images',
        },
        {
            label: 'Audio',
            value: 'audio',
        },
        {
            label: 'Documents',
            value: 'documents',
        },
        {
            label: 'Other',
            value: 'other',
        },
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Videos',
            value: 'videos',
        },
        {
            label: 'Images',
            value: 'images',
        },
        {
            label: 'Audio',
            value: 'audio',
        },
        {
            label: 'Documents',
            value: 'documents',
        },
        {
            label: 'Other',
            value: 'other',
        },
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Videos',
            value: 'videos',
        },
        {
            label: 'Images',
            value: 'images',
        },
        {
            label: 'Audio',
            value: 'audio',
        },
        {
            label: 'Documents',
            value: 'documents',
        },
        {
            label: 'Other',
            value: 'other',
        },
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Videos',
            value: 'videos',
        },
        {
            label: 'Images',
            value: 'images',
        },
        {
            label: 'Audio',
            value: 'audio',
        },
        {
            label: 'Documents',
            value: 'documents',
        },
        {
            label: 'Other',
            value: 'other',
        },

    ]
    // return <pre>{JSON.stringify(data, null, 2)}</pre>
    return <ContentLayout title="Library">
        <SelectionWrapper />
        <div className="flex gap-4 items-center justify-between">
            <div className="flex  gap-2 overflow-x-hidden">
                <TagBar />
            </div>

            <div className="flex justify-end items-center gap-2">
                <ImportVideoDialog />
                <FilterForm />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {data.map((item) => (
                <PostCard key={item.id} item={item as any} />
            ))}
        </div>
        <div className="flex justify-center mt-6">
            <Pagination totalCount={count} limit={limit} />
        </div>
    </ContentLayout>
}