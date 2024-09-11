import { ContentLayout } from "@/components/admin-panel/content-layout";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeam, getTeamMembers, getProjectMembersWithRoles } from "@/services/teamService";
import { MoreVerticalIcon, User2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function Page({ params }: { params: { id: string } }) {
    const team = await getTeam(params.id);
    const members = await getProjectMembersWithRoles(params.id);
    // const projects = await getTeamProjects(params.id);
    // const messages = await getTeamMessages(params.id);
    // const activity = await getTeamActivity(params.id);

    return (
        <ContentLayout title="Team">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{team.name}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                            <Avatar>
                                <AvatarImage src={team.avatar} alt={`${team.name} avatar`} />
                                <AvatarFallback>
                                    <User2Icon className="w-4 h-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm text-muted-foreground">Owner ID: {team.ownerId}</p>
                            </div>
                        </div>
                        <CardDescription className="mt-2">{team.description}</CardDescription>
                        <div className="mt-2 text-sm text-muted-foreground">
                            <p>Created: {new Date(team.createdAt).toLocaleDateString()}</p>
                            <p>Last Updated: {formatDistanceToNow(new Date(team.updatedAt), { addSuffix: true })}</p>
                        </div>
                    </CardHeader>
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
                            <CardHeader>
                                <CardTitle>Members</CardTitle>
                            </CardHeader>
                            <CardContent>
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