import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTeamsByUserId } from "@/services/teamService";
import { User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CreateTeamForm } from "./_forms";
import { auth } from "@/services/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Teams',
    description: 'View your teams',
}

export default async function Page() {
    const { user } = await auth()
    const teams = await getTeamsByUserId(user.id);
    return <ContentLayout title="Teams">
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Teams</h1>
                    <p className="text-sm text-gray-500">Manage your teams here.</p>
                </div>
                <CreateTeamForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                    <div key={team.id} className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={team.avatar} />
                                <AvatarFallback>
                                    <User2Icon className="w-4 h-4" />
                                </AvatarFallback>
                            </Avatar>

                            <h2 className="text-lg font-semibold">
                                <Link href={`/teams/${team.id}`} className="hover:text-primary/80 transition-colors">
                                    {team.name}
                                </Link>
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{team.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </ContentLayout>
}