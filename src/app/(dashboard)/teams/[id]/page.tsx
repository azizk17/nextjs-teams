import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function Page() {
    return <ContentLayout title="Team2">
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Team</h1>
            </div>
        </div>
    </ContentLayout>
}