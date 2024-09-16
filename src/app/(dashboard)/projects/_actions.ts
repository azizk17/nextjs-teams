"use server"

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/services/authService';
import { createProject } from '@/services/projectService';
import { faker } from '@faker-js/faker';

const ProjectSchema = z.object({
    name: z.string().min(2, { message: 'Project name must be at least 2 characters' }),
    description: z.string().optional(),
});

export async function createProjectAction(prevState: any, formData: FormData) {
    const { user } = await auth();
    if (!user) {
        return {
            success: false,
            status: 401,
            message: 'Unauthorized',
        };
    }

    const validated = ProjectSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
            message: 'Invalid input',
        };
    }

    try {
        const project = await createProject({
            name: validated.data.name,
            description: validated.data.description || '',
            avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${crypto.randomUUID()}&backgroundType=gradientLinear&backgroundColor=${faker.color.rgb().slice(1)}&size=${faker.number.int({ min: 100, max: 500 })}&shapeColor=${faker.color.rgb().slice(1)}`,
            // avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${crypto.randomUUID()}`,
            ownerId: user.id,
        });

        revalidatePath('/projects');
        return {
            success: true,
            message: 'Project created successfully',
            project,
        };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : 'Failed to create project',
        };
    }
}
