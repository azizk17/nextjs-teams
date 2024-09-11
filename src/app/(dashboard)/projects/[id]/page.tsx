import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getProjectById } from "@/services/projectService";

export default async function Page({ params }: { params: { id: string } }) {
    const project = await getProjectById(params.id);
    return <ContentLayout title={"Project"}>
        <div>
            <pre>{JSON.stringify(project, null, 2)}</pre>
        </div>
    </ContentLayout>
}