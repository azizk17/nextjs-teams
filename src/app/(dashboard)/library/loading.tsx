import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function LibraryLoading() {
    return (
        <ContentLayout title="Library">
            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Skeleton className="h-8 w-full md:w-1/2" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
                {[...Array(9)].map((_, index) => (
                    <PostCardSkeleton key={index} />
                ))}
            </div>
            <div className="flex justify-center mt-6">
                <Skeleton className="h-10 w-64" />
            </div>
        </ContentLayout>
    );
}

function PostCardSkeleton() {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-2">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Skeleton className="w-8 h-8 rounded-full mr-2" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
}
