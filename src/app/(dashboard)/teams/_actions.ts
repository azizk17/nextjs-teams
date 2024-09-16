"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ActionResponse } from '@/types';
import { CreateTeamSchema, Team } from '@/db/schema';
import { addMemberToTeam, createTeam, createTeamInvitation, deleteTeam, updateTeam } from '@/services/teamService';
import { redirect } from 'next/navigation';
import { auth } from '@/services/auth';
import { getUserByEmail, getUserByUsername } from '@/services/userService';

// Update schemas
const ChangeRoleSchema = z.object({
    memberId: z.string(),
    newRole: z.enum(['admin', 'member', 'guest']),
});

const ToggleMemberStatusSchema = z.object({
    memberId: z.string(),
    status: z.enum(['enable', 'disable']),
});

const DeleteMemberSchema = z.object({
    memberId: z.string(),
});


/**
 * Creates a new team action.
 * 
 * @param prevState - The previous state (unused in this action).
 * @param formData - The form data containing team information.
 * @returns A Promise resolving to an ActionResponse.
 * 
 * This action validates the input using the CreateTeamSchema,
 * creates a new team using the teamService, and redirects to
 * the new team's page on success. It handles errors by returning
 * appropriate error responses.
 * 
 * Note: The user ID is currently hardcoded and should be replaced
 * with the actual user ID from the session in a production environment.
 */
export async function createTeamAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    // get user id from session
    const { user } = await auth()

    const validated = CreateTeamSchema.omit({ id: true }).safeParse({
        // id: "23e23",
        name: formData.get("name"),
        description: formData.get("description"),
        ownerId: user.id,
        // avatar: formData.get("avatar"),
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${formData.get("name")}`,
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            message: "Failed to create team",
            errors: validated.error.flatten().fieldErrors,
        };
    }
    let team: Team | null = null;
    try {
        team = await createTeam({
            name: validated.data.name,
            avatar: validated.data.avatar || undefined,
            description: validated.data.description || undefined,
            ownerId: validated.data.ownerId,
        });
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : 'Failed to create team',
        };
    }
    redirect(`/teams/${team?.id}`);
}


/**
 * Updates a team's information.
 * 
 * @param prevState - The previous state (unused in this action).
 * @param formData - The form data containing team information.
 * @returns A Promise resolving to an ActionResponse.
 * 
 * This action validates the input using the CreateTeamSchema,
 * updates the team using the teamService, and revalidates the path
 * to the team's page on success. It handles errors by returning
 * appropriate error responses.
 */
export async function updateTeamAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const validated = CreateTeamSchema.pick({ id: true, name: true, description: true }).safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
        };
    }

    try {
        const team = await updateTeam(validated.data.id, {
            name: validated.data.name,
            description: validated.data.description,
        });
        revalidatePath(`/teams/${team.id}`);
        return { success: true, message: "Team updated successfully" };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : 'Failed to update team',
        };
    }
}

/**
 * Deletes a team.
 * 
 * @param prevState - The previous state (unused in this action).
 * @param formData - The form data containing the team ID.
 * @returns A Promise resolving to an ActionResponse.
 * 
 * This action validates the input using the CreateTeamSchema,
 * deletes the team using the teamService, and revalidates the path
 * to the teams page on success. It handles errors by returning
 * appropriate error responses.
 */
export async function deleteTeamAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const validated = CreateTeamSchema.pick({ id: true }).safeParse({
        id: formData.get("id"),
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
        };
    }

    try {
        await deleteTeam(validated.data.id);
        revalidatePath("/teams");
        return { success: true, message: "Team deleted successfully" };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : 'Failed to delete team',
        };
    }
}


/**
 * Changes the role of a team member.
 * 
 * @param prevState - The previous state (unused in this action).
 * @param formData - The form data containing member ID and new role.
 * @returns A Promise resolving to an ActionResponse.
 * 
 * This action validates the input using the ChangeRoleSchema,
 * updates the member's role using the teamService, and revalidates
 * the path to the teams page on success. It handles errors by returning
 * appropriate error responses.
 */
export async function changeRoleAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const validated = ChangeRoleSchema.safeParse({
        memberId: formData.get("memberId"),
        newRole: formData.get("newRole"),
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
        };
    }

    try {
        // Implement role change logic here
        // const updatedMember = await updateMemberRole(validated.data.memberId, validated.data.newRole);

        revalidatePath("/teams");
        return { success: true, message: "Role updated successfully" };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : 'Failed to update role',
        };
    }
}

/**
 * Toggles the status of a team member.
 * 
 * @param prevState - The previous state (unused in this action).
 * @param formData - The form data containing member ID and status.
 * @returns A Promise resolving to an ActionResponse.
 * 
 * This action validates the input using the ToggleMemberStatusSchema,
 * updates the member's status using the teamService, and revalidates
 * the path to the teams page on success. It handles errors by returning
 * appropriate error responses.
 */
export async function toggleMemberStatusAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const validated = ToggleMemberStatusSchema.safeParse({
        memberId: formData.get("memberId"),
        status: formData.get("status"),
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
        };
    }

    try {
        const { memberId, status } = validated.data;
        // Implement member status toggle logic here
        // if (status === 'disable') {
        //   await disableMember(memberId);
        // } else {
        //   await enableMember(memberId);
        // }

        revalidatePath("/teams");
        return {
            success: true,
            message: `Member ${status === 'disable' ? 'disabled' : 'enabled'} successfully`
        };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : `Failed to ${validated.data.status} member`,
        };
    }
}

/**
 * Deletes a team member.
 * 
 * @param prevState - The previous state (unused in this action).
 * @param formData - The form data containing the member ID.
 * @returns A Promise resolving to an ActionResponse.
 * 
 * This action validates the input using the DeleteMemberSchema,
 * deletes the member using the teamService, and revalidates the path
 * to the teams page on success. It handles errors by returning
 * appropriate error responses.
 */
export async function deleteMemberAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const validated = DeleteMemberSchema.safeParse({
        memberId: formData.get("memberId"),
    });

    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
        };
    }

    try {
        // Implement member deletion logic here
        // await deleteMember(validated.data.memberId);

        revalidatePath("/teams");
        return { success: true, message: "Member deleted successfully" };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : 'Failed to delete member',
        };
    }
}

const InviteMembersSchema = z.object({
    teamId: z.string(),
    emailOrUsername: z.string(),
    role: z.enum(['admin', 'member', 'guest'])
        .refine(
            (value) => {
                // Check if it's an email format
                const emailSchema = z.string().email();
                if (emailSchema.safeParse(value).success) {
                    return true;
                }
                const usernameSchema = z.string().min(3);
                return usernameSchema.safeParse(value).success;
            },
            {
                message: "Invalid email or username format",
            }
        ),
});

export async function inviteMembersAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const { user } = await auth()
    const validated = InviteMembersSchema.safeParse({
        teamId: formData.get("teamId"),
        emailOrUsername: formData.get("emailOrUsername"),
        role: formData.get("role"),
    });
    if (!validated.success) {
        return {
            success: false,
            status: 400,
            errors: validated.error.flatten().fieldErrors,
            message: "Failed to invite members",
        };
    }

    try {
        const { teamId, emailOrUsername, role } = validated.data;

        // Determine if the input is an email or username
        const isEmail = z.string().email().safeParse(emailOrUsername).success;
        const userToInvite = isEmail ? await getUserByEmail(emailOrUsername) : await getUserByUsername(emailOrUsername);

        if (!userToInvite && isEmail) {
            const invitation = await createTeamInvitation({
                teamId,
                inviteeEmail: emailOrUsername,
                inviterId: user.id,
                role,
                token: crypto.randomUUID(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
            });
            // TODO: send email to the invitee 
            // send email to the invitee 
            // await sendEmail(invitation.token, invitation.inviteeEmail);
            return { success: true, message: "Invitation sent successfully" };
        }

        if (!user) {
            return {
                success: false,
                status: 404,
                message: "User not found",
            };
        }
        await addMemberToTeam(teamId, user.id, role);

        revalidatePath(`/teams/${teamId}`);
        return { success: true, message: "Member added successfully" };
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : 'Failed to delete member',
        };
    }
}

// toggle team status
export async function toggleTeamStatusAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const validated = CreateTeamSchema.pick({ id: true }).safeParse({
        id: formData.get("id"),
    });
}