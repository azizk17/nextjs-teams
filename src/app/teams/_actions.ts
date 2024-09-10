'use server'
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    name: z.string().min(2, { message: "Team name must be at least 2 characters." }),
    description: z.string().optional(),
    avatar: z.string().url().optional(),
});

export async function createTeamAction(prevState: any, formData: FormData) {

    // Sleep for 1s
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validated = formSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        avatar: formData.get("avatar"),
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
        };
    }

    try {
        // Your logic to create a team goes here
        // For example:
        // const newTeam = await createTeam(validated.data);

        revalidatePath("/teams");
        return { success: true, data: validated.data };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            // data: { formData }
        };
    }
}

export async function updateTeamMemberRoleAction(prevState: any, formData: FormData) {
    // Sleep for 1s
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validated = formSchema.safeParse({
        role: formData.get("role"),
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
        };
    }

    try {
        // Your logic to update a team member role goes here
        // For example:
        // const updatedTeamMember = await updateTeamMemberRole(validated.data);

        revalidatePath("/teams");
        return { success: true, data: validated.data };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
        }
    }
}

