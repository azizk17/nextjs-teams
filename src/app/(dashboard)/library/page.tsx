import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
    return <ContentLayout title="Library">
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">Library</h1>
                <Button>Add</Button>
            </div>
        </div>
    </ContentLayout>
}