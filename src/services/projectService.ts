/**
 * Project Service
 * 
 * Handles CRUD operations and business logic for projects.
 * Manages project data, permissions, and integrates with other services.
 * Acts as an abstraction layer between application logic and data persistence.
 */

import db from "@/db";
import { InsertProject, projectsTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getProjectsByUserId(userId: string) {
    return db.select({
        id: projectsTable.id,
        name: projectsTable.name,
        avatar: projectsTable.avatar,
        description: projectsTable.description,
        createdAt: projectsTable.createdAt,
        updatedAt: projectsTable.updatedAt,
    }).from(projectsTable)
        .where(eq(projectsTable.ownerId, userId))
        .orderBy(desc(projectsTable.createdAt));
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
    const [project] = await db.select({
        id: projectsTable.id,
        name: projectsTable.name,
        description: projectsTable.description,
        avatar: projectsTable.avatar,
        createdAt: projectsTable.createdAt,
        updatedAt: projectsTable.updatedAt,
    }).from(projectsTable)
        .where(eq(projectsTable.id, id));

    return project;
}

export async function createProject(project: InsertProject) {
    return db.insert(projectsTable).values(project).returning();
}

export async function updateProject(id: string, project: { name: string, description: string }) {
    return db.update(projectsTable).set(project).where(eq(projectsTable.id, id));
}

export async function deleteProject(id: string) {
    return db.delete(projectsTable).where(eq(projectsTable.id, id));
}