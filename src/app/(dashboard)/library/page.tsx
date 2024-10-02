import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getAllMedia, getMediaCount } from "@/services/mediaService";
import Pagination from "@/components/pagination";
import { FilterForm } from "./_filters";
import { ImportVideoDialog } from "./_forms";
import { PostCard } from "./post-card";
import { SelectionWrapper } from "./selection-wrapper";
import { TagBar } from "@/components/tag-bar";

export default async function LibraryPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const page = +(searchParams.page ?? 1);
    const limit = +(searchParams.limit ?? 20);

    const data = await getAllMedia({ page, limit });
    const count = await getMediaCount();
    return <ContentLayout title="Library" >
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-6">
            {data.map((item) => (
                <PostCard key={item.id} item={item as any} />
            ))}
        </div>
        <div className="flex justify-center mt-6">
            <Pagination totalCount={count} limit={limit} />
        </div>
    </ContentLayout>
}