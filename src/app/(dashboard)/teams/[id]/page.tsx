import { ContentLayout } from "@/components/admin-panel/content-layout";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeam, getTeamMembers, getProjectMembersWithRoles } from "@/services/teamService";
import { MoreVerticalIcon, PencilIcon, User2Icon, PlusIcon, TrashIcon, PowerIcon, EditIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteTeamForm, InviteMembersForm, ToggleTeamStatusForm, UpdateTeamForm } from "../_forms";
import { auth } from "@/services/auth";
import { Metadata } from "next";
import { authGuard } from "@/services/authService";
import { notFound, redirect } from "next/navigation";


export const metadata: Metadata = {
    title: 'Team',
    description: 'View your team',
}

export default async function Page({ params }: { params: { id: string } }) {
    const { authorized, error, user, can } = await authGuard("")
    if (!authorized) {
        redirect(error?.redirect!)
    }
    const team = await getTeam(params.id);
    if (!team) {
        notFound()
    }
    const members = await getProjectMembersWithRoles(params.id);
    // const projects = await getTeamProjects(params.id);
    // const messages = await getTeamMessages(params.id);
    // const activity = await getTeamActivity(params.id);

    return (
        <ContentLayout title="Team">
            <div className="flex flex-col gap-6">
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg">
                    <CardHeader className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-20 h-20 border-4 border-primary/20">
                                    <AvatarImage src={team.avatar!} alt={`${team.name} avatar`} className="w-full h-full" />
                                    <AvatarFallback>
                                        <User2Icon className="w-10 h-10" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <CardTitle className="text-2xl">{team.name}</CardTitle>
                                        <UpdateTeamForm team={team} />
                                    </div>
                                    <CardDescription className="mt-1 text-muted-foreground text-sm line-clamp-2 max-w-2xl">{team.description}</CardDescription>
                                    <p className="text-sm text-muted-foreground mt-1">Owner ID: {team.ownerId}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                                <InviteMembersForm team={team} trigger={
                                    <Button variant="outline" size="sm">
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Add Member
                                    </Button>
                                } />
                                <ToggleTeamStatusForm team={team} />
                                <DeleteTeamForm team={team} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="bg-card/50 p-4 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <p>Created: {new Date(team.createdAt!).toLocaleDateString()}</p>
                            <p>Last Updated: {formatDistanceToNow(new Date(team.updatedAt!), { addSuffix: true })}</p>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="members">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                    </TabsList>
                    <TabsContent value="members">
                        <Card>
                            {/* <CardHeader>
                                <CardTitle>Members</CardTitle>
                            </CardHeader> */}
                            <CardContent className="pt-4">
                                {members.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-4">
                                        <div className="text-center text-muted-foreground">
                                            <p>This team is looking a bit lonely.</p>
                                            <p className="mt-2">Invite some colleagues to join and start collaborating!</p>
                                        </div>
                                        <Button variant="outline">
                                            <PlusIcon className="w-4 h-4 mr-2" />
                                            Invite Members
                                        </Button>
                                    </div>
                                ) : (
                                    <ul className="space-y-4">
                                        {members.map((member) => (
                                            <li key={member.userEmail} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar>
                                                        <AvatarImage src={member.userAvatar} alt={`${member.userName} avatar`} />
                                                        <AvatarFallback>
                                                            <User2Icon className="w-4 h-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{member.userName}</p>
                                                        <p className="text-sm text-muted-foreground">{member.userEmail}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Select defaultValue={member.roles[0].id}>
                                                        <SelectTrigger className="w-24">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                        {member.roles.map((role) => (
                                                            <SelectContent>
                                                                <SelectItem key={role.id} value={role.id}>
                                                                    {role.name}
                                                                </SelectItem>
                                                            </SelectContent>
                                                        ))}
                                                    </Select>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVerticalIcon className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Remove</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Activity content goes here...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="projects">
                        <Card>
                            <CardHeader>
                                <CardTitle>Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Projects content goes here...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="messages">
                        <Card>
                            <CardHeader>
                                <CardTitle>Messages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Messages content goes here...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </ContentLayout>
    );
};