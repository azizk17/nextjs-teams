import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/services/authService";
import { getProjectsByUserId } from "@/services/projectService";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";


interface Project {
    id: string;
    name: string;
    avatar?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <div className="relative h-40 w-full ">
                <Link href={`/projects/${project.id}`} className="hover:opacity-80">
                    <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={project.avatar} alt={project.name} className="object-cover" />
                        <AvatarFallback className="w-full h-full rounded-none flex items-center justify-center text-2xl font-bold text-gray-400">
                            <ImageIcon className="w-10 h-10" />
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
            <CardHeader>
                <CardTitle>
                    <Link href={`/projects/${project.id}`} className="hover:text-primary/80">
                        {project.name}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">{project.description || "No description available."}</p>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
                <div className="flex justify-between w-full">
                    <span>Members: 5</span>
                    <span>Tasks: 10</span>
                </div>
            </CardFooter>
        </Card >
    );
};

function ProjectList({ title, projects }: { title: string; projects: Project[] }) {
    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {projects.length === 0 ? (
                <p className="text-gray-500">No projects found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default async function Page() {

    const { isAuthenticated } = await auth()
    if (!isAuthenticated) {
        return redirect('/signin')
    }

    const userId = "9";
    const ownedProjects = await getProjectsByUserId(userId);
    // TODO: Implement getSharedProjects function in projectService
    const sharedProjects: Project[] = []; // await getSharedProjects(userId);


    return (
        <ContentLayout title="Projects">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Projects</h1>
                </div>
                <ProjectList title="My Projects" projects={ownedProjects} />
                <ProjectList title="Shared Projects" projects={sharedProjects} />
            </div>
        </ContentLayout>
    );
}