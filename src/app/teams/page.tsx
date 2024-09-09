import React from 'react';
import { Users, MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getUserTeams } from '@/auth';
import Link from 'next/link';

const teamsData = [
  { id: 1, name: 'Engineering', memberCount: 15, description: 'Software development team' },
  { id: 2, name: 'Marketing', memberCount: 8, description: 'Brand and growth team' },
  { id: 3, name: 'Sales', memberCount: 12, description: 'Revenue generation team' },
  { id: 4, name: 'Design', memberCount: 6, description: 'UI/UX and product design team' },
];

const TeamCard = ({ team }) => (
  <Link href={`/teams/${team.id}`} className="block group">
    <Card className="hover:shadow-md transition-shadow group-hover:bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{team.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Team</DropdownMenuItem>
            <DropdownMenuItem>Edit Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete Team</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardDescription>{team.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4 opacity-70" /> <span>{team.memberCount} members</span>
        </div>
        <Button variant="outline" size="sm">Manage</Button>
      </CardFooter>
    </Card>
  </Link>
);

export default async function Page(){

    const data = await getUserTeams("2")
  return (
    <div className="container mx-auto p-4">
        <pre>
            {JSON.stringify(data, null,2)}
        </pre>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Team
        </Button>
      </div>
      <div className="mb-6">
        <Input type="text" placeholder="Search teams..." className="max-w-sm" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
};