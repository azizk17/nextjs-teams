import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjectById } from "@/services/projectService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Users, Settings, MessageCircle, Mail, Star, Bookmark, Filter, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaJira, FaSlack, FaGithub, FaTrello } from "react-icons/fa";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ProjectFilterForm } from "./_forms";
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
            <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                    <Card className="flex-grow">
                        <CardContent className="p-2">
                            <div className="flex items-start space-x-6">
                                <Avatar className="w-32 h-32 rounded-lg">
                                    <AvatarImage src={project.avatar} alt={project.name} />
                                    <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col max-w-xl">
                                            <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                                            <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{project.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="relative group">
                                                <ProjectFilterForm trigger={
                                                    <>
                                                        <Button variant="secondary" size="icon">
                                                            <Filter className="h-4 w-4" />
                                                        </Button>
                                                        <span className="absolute hidden group-hover:inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded-md -bottom-8 left-1/2 transform -translate-x-1/2">
                                                            Filter
                                                        </span>
                                                    </>
                                                } />
                                            </div>
                                            <div className="relative group">
                                                <Button variant="secondary" size="icon">
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                                <span className="absolute hidden group-hover:inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded-md -bottom-8 left-1/2 transform -translate-x-1/2">
                                                    Search
                                                </span>
                                            </div>
                                            <div className="relative group">
                                                <Link href={`/projects/${project.id}/settings/general`}
                                                    className={cn(buttonVariants({ variant: "secondary", size: "icon" }))}
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Link>
                                                <span className="absolute hidden group-hover:inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded-md -bottom-8 left-1/2 transform -translate-x-1/2">
                                                    Settings
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex space-x-2">

                                            <Badge variant="secondary" className="text-sm">
                                                <Users className="w-4 h-4 mr-1" />
                                                {project?.members?.length || 0} Members
                                            </Badge>
                                            <Badge variant="secondary" className="text-sm">
                                                <Bookmark className="w-4 h-4 mr-1" />
                                                {project?.status || 'Active'}
                                            </Badge>
                                        </div>
                                        <div className="flex space-x-2">
                                            {integrations.map((integration) => (
                                                <HoverCard key={integration.id} openDelay={100} closeDelay={0} >
                                                    <HoverCardTrigger>
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-full text-muted-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 hover:cursor-pointer ring-4 ring-offset-2 ring-offset-background ring-ring ",
                                                            integration.isConnected ? "ring-green-600" : "ring-muted"
                                                        )}>
                                                            <integration.icon className={cn(
                                                                "w-6 h-6",
                                                                // integration.isConnected ? "text-green-600" : "text-gray-400"
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-1/3">
                        <CardContent className="pt-6">
                            <div className=" divide-y divide-muted">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">Total Tasks</span>
                                    <span className="text-sm font-medium">24</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">Completed Tasks</span>
                                    <span className="text-sm font-medium">18</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">Active Members</span>
                                    <span className="text-sm font-medium">5</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">Days Active</span>
                                    <span className="text-sm font-medium">30</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="posts">
                    <TabsList className="">
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
        </ContentLayout>
    );
}