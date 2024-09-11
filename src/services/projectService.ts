/**
 * Project Service
 * 
 * Handles CRUD operations and business logic for projects.
 * Manages project data, permissions, and integrates with other services.
 * Acts as an abstraction layer between application logic and data persistence.
 */

import db from "@/db";
import { projectsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProjectsByUserId(userId: string) {
    return db.select({
        id: projectsTable.id,
        name: projectsTable.name,
        avatar: projectsTable.avatar,
        description: projectsTable.description,
        createdAt: projectsTable.createdAt,
        updatedAt: projectsTable.updatedAt,
    }).from(projectsTable)
        .where(eq(projectsTable.ownerId, userId));
}


export async function getProjectsByTeamId(teamId: string) {
    return db.select({
        id: projectsTable.id,
        name: projectsTable.name,
        description: projectsTable.description,
        createdAt: projectsTable.createdAt,
        updatedAt: projectsTable.updatedAt,
    }).from(projectsTable)
        .where(eq(projectsTable.teamId, teamId));
}

export async function getProjectById(id: string) {
    return db.select({
        id: projectsTable.id,
        name: projectsTable.name,
        description: projectsTable.description,
        createdAt: projectsTable.createdAt,
        updatedAt: projectsTable.updatedAt,
    }).from(projectsTable)
        .where(eq(projectsTable.id, id));
}