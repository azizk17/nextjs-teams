import Link from 'next/link'
import { PlusIcon, FolderIcon, ImageIcon, HeartIcon, MessageCircleIcon, ShareIcon, BellIcon, CheckIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import { getUserProjects } from '@/auth/users'
// This would typically come from an API or database
const projects = [
  { id: 1, title: "E-commerce Platform", description: "An online marketplace for artisanal goods", status: "In Progress", lastUpdated: "2023-07-15" },
  { id: 2, title: "Task Management App", description: "A collaborative tool for team productivity", status: "Completed", lastUpdated: "2023-06-30" },
  { id: 3, title: "Fitness Tracker", description: "Mobile app for tracking workouts and nutrition", status: "Planning", lastUpdated: "2023-07-10" },
  { id: 4, title: "Social Media Dashboard", description: "Analytics tool for social media managers", status: "In Progress", lastUpdated: "2023-07-12" },
]

export default async function ProjectsPage() {
  const data = await getUserProjects('1')
  // return (
  //   <pre>{JSON.stringify(data, null, 2)} </pre>
  // )
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="h-40 relative">
              <Link href={`/projects/${project.id}`}>
                <img
                  src={project.avatar || '/placeholder.svg'}
                  alt={`${project.name}`}
                  width={300}
                  height={200}
                  className='w-full h-full object-cover'

                />
              </Link>
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm truncate">
                <Link href={`/projects/${project.id}`} className='hover:text-primary/80'>
                  {project.name}
                </Link>
              </h3>
              <p className="text-xs text-muted-foreground">{project.subscribers} subscribers</p>
            </CardContent>
            <CardFooter className="p-2">
              <Button variant="secondary" size="sm" className="w-full">
                <BellIcon className="w-3 h-3 mr-1" /> Subscribe
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}