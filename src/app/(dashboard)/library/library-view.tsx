'use client'
import { useLibraryViewStore } from "@/hooks/use-library-store";
import { PostCard } from "./post-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PostCardMain from "@/components/post-card/post-card-main";
import DataTable from "./_components/posts-datatable";

export function LibraryView({ items }: { items: any[] }) {
    const viewMode = useLibraryViewStore(state => state.viewMode);

    return viewMode === 'grid' ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6`}>
            {items.map((item) => (
                // <PostCard key={item.id} item={item as any} />
                <PostCardMain key={item.id} item={item as any} />
            ))}
        </div>
    ) : (
        <div className="flex justify-center mt-6">
            <DataTable data={items} />
        </div>
    )
}