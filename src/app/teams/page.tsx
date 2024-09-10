import React from 'react';
import { Users, MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getUserTeams } from '@/auth';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateTeamForm } from './_forms';
import { TeamRepository } from '@/repositories';

const teamsData = [
  { id: 1, name: 'Engineering', memberCount: 15, description: 'Software development team' },
  { id: 2, name: 'Marketing', memberCount: 8, description: 'Brand and growth team' },
  { id: 3, name: 'Sales', memberCount: 12, description: 'Revenue generation team' },
  { id: 4, name: 'Design', memberCount: 6, description: 'UI/UX and product design team' },
];

const TeamCard = ({ team }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center mb-2">
        <Avatar className="me-2">
          <AvatarImage src={team.avatar} />
          <AvatarFallback>
            <Users className="h-6 w-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg truncate hover:text-primary/80">
          <Link href={`/teams/${team.id}`}>
            {team.name}
          </Link>
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{team.description}</p>
      <div className="flex items-center text-sm text-muted-foreground">
        <Users className="mr-2 h-4 w-4" />
        <span>{team.memberCount} members</span>
      </div>
    </CardContent>
    <CardFooter className="p-2 bg-secondary">
      <Link href={`/teams/${team.id}`}>
        <Button variant="secondary" size="sm" className="w-full">
          View Team
        </Button>
      </Link>
    </CardFooter>
  </Card >
);

export default async function Page() {
  const repo = new TeamRepository()
  // const data = await getUserTeams("2")
  const data = await repo.getTeamsByUserId("2")
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <CreateTeamForm />
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