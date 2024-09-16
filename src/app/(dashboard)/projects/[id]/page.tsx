import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjectById } from "@/services/projectService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Users, Settings, MessageCircle, Mail, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaJira, FaSlack, FaGithub, FaTrello } from "react-icons/fa";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
const integrations = [
    { id: 1, name: "Jira", icon: FaJira, isConnected: true },
    { id: 2, name: "Slack", icon: FaSlack, isConnected: true },
    { id: 3, name: "GitHub", icon: FaGithub, isConnected: false },
    { id: 4, name: "Trello", icon: FaTrello, isConnected: false },
];

export default async function Page({ params }: { params: { id: string } }) {
    const project = await getProjectById(params.id);

    return (
        <ContentLayout title={project.name}>
            <div className="flex gap-6">
                <div className="flex-grow">
                    <div className="flex flex-col gap-6">
                        <Card className="">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-6">
                                    <Avatar className="w-32 h-32">
                                        <AvatarImage src={project.avatar} alt={project.name} />
                                        <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col max-w-xl">
                                                <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                                                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{project.description}</p>
                                            </div>
                                            <Link href={`/projects/${project.id}/settings/general`}
                                                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Settings
                                            </Link>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary" className="text-sm">
                                                <Users className="w-4 h-4 mr-1" />
                                                {project?.members?.length} Members
                                            </Badge>
                                            <div className="flex space-x-2">
                                                {integrations.map((integration) => (
                                                    <HoverCard key={integration.id} openDelay={100} closeDelay={0} >
                                                        <HoverCardTrigger>
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:cursor-pointer",
                                                                integration.isConnected ? "bg-green-100" : "bg-gray-100"
                                                            )}>
                                                                <integration.icon className={cn(
                                                                    "w-6 h-6",
                                                                    integration.isConnected ? "text-green-600" : "text-gray-400"
                                                                )} />
                                                            </div>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-80">
                                                            <div className="flex justify-between space-x-4">
                                                                <div className="space-y-1">
                                                                    <h4 className="text-sm font-semibold">{integration.name}</h4>
                                                                    <p className="text-sm">
                                                                        Status: {integration.isConnected ? "Connected" : "Not connected"}
                                                                    </p>
                                                                    {integration.isConnected && (
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Connected since: [Date]
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                ))}
                                                {/* <Button variant="outline" size="sm" className="ml-2">
                                                    Manage Integrations
                                                </Button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="posts">
                            <TabsList>
                                <TabsTrigger value="posts">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Posts
                                </TabsTrigger>
                                <TabsTrigger value="comments">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Comments
                                </TabsTrigger>
                                <TabsTrigger value="messages">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Messages
                                </TabsTrigger>
                                <TabsTrigger value="recommendations">
                                    <Star className="w-4 h-4 mr-2" />
                                    Recommendations
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="posts">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Posts</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Add a list of posts here */}
                                        <p>List of posts will go here</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="comments">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Comments</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Add a list of comments here */}
                                        <p>List of comments will go here</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="messages">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Messages</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Add a list of messages here */}
                                        <p>List of messages will go here</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="recommendations">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Recommendations</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Add a list of recommendations here */}
                                        <p>List of recommendations will go here</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <div className="w-1/3">
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Add a list of members here */}
                                <p>List of members will go here</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Add a list of tasks here */}
                                <p>List of tasks will go here</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
}