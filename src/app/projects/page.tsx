import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// This would typically come from an API or database
const projects = [
  { id: 1, title: "E-commerce Platform", description: "An online marketplace for artisanal goods", status: "In Progress", lastUpdated: "2023-07-15" },
  { id: 2, title: "Task Management App", description: "A collaborative tool for team productivity", status: "Completed", lastUpdated: "2023-06-30" },
  { id: 3, title: "Fitness Tracker", description: "Mobile app for tracking workouts and nutrition", status: "Planning", lastUpdated: "2023-07-10" },
  { id: 4, title: "Social Media Dashboard", description: "Analytics tool for social media managers", status: "In Progress", lastUpdated: "2023-07-12" },
]

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> New Project
        </Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Status: {project.status}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-gray-500">Last updated: {project.lastUpdated}</p>
              <Link href={`/projects/${project.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}