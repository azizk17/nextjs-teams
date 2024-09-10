import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, UserCheck, UserMinus, Trash2 } from "lucide-react"
import { getTeamById } from "@/auth/teams"
import { User2 } from "lucide-react"
import { TeamRepository } from "@/repositories"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import UserRolesManager from "../userRoleForm"
import { updateTeamMemberRoleAction } from "../_actions"
// Mock data - replace with actual data fetching logic
const teamData = {
  name: "Engineering Team",
  members: [
    { id: 1, name: "John Doe", role: "Lead Engineer" },
    { id: 2, name: "Jane Smith", role: "Frontend Developer" },
    // ... more members
  ],
  activities: [
    { id: 1, description: "John Doe pushed a commit to main branch", timestamp: "2023-04-01T10:00:00Z" },
    { id: 2, description: "Jane Smith created a new pull request", timestamp: "2023-04-01T11:30:00Z" },
    // ... more activities
  ],
  projects: [
    { id: 1, name: "Project Alpha", description: "Main product development" },
    { id: 2, name: "Project Beta", description: "New feature implementation" },
    // ... more projects
  ],
  channels: [
    { id: 1, name: "general", description: "General discussion" },
    { id: 2, name: "dev-ops", description: "DevOps related topics" },
    // ... more channels
  ],
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const teamRepository = new TeamRepository();
  const data = await teamRepository.getTeamById(params.id)
//   return <pre>{JSON.stringify(data, null, 2)}</pre>
const roles = [
    { id: '1', name: 'Admin' },
    { id: '2', name: 'Member' },
    { id: '3', name: 'Guest' },
    { id: '4', name: 'Owner' },
    { id: '5', name: 'Editor' },
    { id: '6', name: 'Viewer' },
  ];
  return (

    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{data?.name}</h1>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className=" divide-y divide-muted">
                {data?.members.map(member => (
                  <li key={member.id} className="flex items-center justify-between space-x-4 py-2 ">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          <User2 className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.username}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                    <UserRolesManager roles={roles} initialRoles={member.roles} formAction={updateTeamMemberRoleAction} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>Toggle Activation</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {teamData.activities.map(activity => (
                  <li key={activity.id} className="border-b pb-2">
                    <p>{activity.description}</p>
                    <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {teamData.projects.map(project => (
                  <li key={project.id} className="border-b pb-2">
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {teamData.channels.map(channel => (
                  <li key={channel.id} className="border-b pb-2">
                    <p className="font-semibold">#{channel.name}</p>
                    <p className="text-sm text-gray-500">{channel.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
