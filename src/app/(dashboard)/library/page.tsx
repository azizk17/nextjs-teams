import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getAllMedia, getMediaCount } from "@/services/mediaService";
import Pagination from "@/components/pagination";
import { FilterForm } from "./_components/_filters";
import { ImportVideoDialog, ToggleGridView } from "./_forms";
import { PostCard } from "./post-card";
import { SelectionWrapper } from "./selection-wrapper";
import { TagBar } from "@/components/tag-bar";
import { useLibraryViewStore } from "@/hooks/use-library-store";
import { LibraryView } from "./library-view";
import { NewPostDialog } from "./_components/new-post";

export default async function LibraryPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const page = +(searchParams.page ?? 1);
    const limit = +(searchParams.limit ?? 20);

    const data = await getAllMedia({ page, limit });
    const count = await getMediaCount();

    return <ContentLayout title="Library" >
        <SelectionWrapper />
        <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-hidden  w-full max-w-screen-lg">
                <TagBar />
            </div>

            <div className="flex justify-end items-center gap-2">
                <ToggleGridView />
                {/* <ImportVideoDialog /> */}
                <NewPostDialog />
                <FilterForm />
            </div>
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <LibraryView items={data} />
        {data.length > 0 && (
            <div className="flex justify-center mt-6">
                <Pagination totalCount={count} limit={limit} />
            </div>
        )}
    </ContentLayout>
}