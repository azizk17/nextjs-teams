import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function TeamPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{teamData.name}</h1>
      
      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {teamData.members.map(member => (
                  <li key={member.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${member.name}`} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
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
