"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ActionResponse } from '@/types';
import { CreateTeamSchema, Team } from '@/db/schema';
import { addMemberToTeam, createTeam, createTeamInvitation, deleteTeam, getTeam, updateTeam, getTeamInvitation, getTeamMember, deleteTeamInvitation } from '@/services/teamService';
import { redirect } from 'next/navigation';
import { auth } from '@/services/auth';
import { getRoleId, getUserByEmail, getUserByUsername } from '@/services/userService';
import { cookies } from 'next/headers'
import { handleActionError, handleActionSuccess, noRes, okRes } from '@/lib/utils';
import { BadRequestError, ConflictError, NotFoundError } from '@/utils/errors';

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

    let team: Team | null = null;
    try {
        const validated = CreateTeamSchema.omit({ id: true }).parse({
            name: formData.get("name"),
            description: formData.get("description"),
            ownerId: user.id,
            // avatar: formData.get("avatar"),
            avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${formData.get("name")}`,
        });
        team = await createTeam({
            name: validated.name,
            avatar: validated.avatar || undefined,
            description: validated.description || undefined,
            ownerId: validated.ownerId,
        });
    } catch (error) {
        return noRes(error);
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
    // auth & authz hook 
    try {
        const validated = CreateTeamSchema.pick({ id: true, name: true, description: true }).parse({
            id: formData.get("id"),
            name: formData.get("name"),
            description: formData.get("description"),
        });
        const team = await updateTeam(validated.id, {
            name: validated.name,
            description: validated.description,
        });
        if (!team) {
            throw new BadRequestError("Team not found");
        }
        revalidatePath(`/teams/${team.id}`);
        return okRes(`Team updated successfully`);
    } catch (error) {
        return noRes(error);
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
    // TODO: auth & authz hook 
    try {
        const validated = z.object({
            id: z.string().min(3, "Team ID is required"),
        }).parse({
            id: formData.get("id"),
        });
        const team = await getTeam(validated.id);
        if (!team) {
            throw new BadRequestError("Team not found");
        }
        await deleteTeam(validated.id);
    } catch (error) {
        return noRes(error);
    }

    redirect("/teams");
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
        const member = await getTeamMember(memberId);
        if (!member) {
            return { success: false, status: 404, message: "Member not found" };
        }
        await updateTeamMember(memberId, { status: status === 'disable' ? 'disable' : 'enable' });
        revalidatePath(`/teams/${teamId}`);

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

    try {
        const validated = DeleteMemberSchema.parse({
            memberId: formData.get("memberId"),
        });
        // Implement member deletion logic here
        // await deleteMember(validated.data.memberId);
        revalidatePath("/teams");
        return okRes("Member deleted successfully");
    } catch (error) {
        return noRes(error);
    }
}

const roleSchema = z.enum(["Publisher", "Editor", "Creator", "Moderator", "Analyst", "Viewer"])
const InviteMembersSchema = z.object({
    teamId: z.string(),
    emailOrUsername: z.string(),
    role: roleSchema
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

export async function inviteMemberAction(prevState: any, formData: FormData): Promise<ActionResponse> {
    const { user } = await auth()

    try {
        const validated = InviteMembersSchema.parse({
            teamId: formData.get("teamId"),
            emailOrUsername: formData.get("emailOrUsername"),
            role: formData.get("role"),
        });
        const { teamId, emailOrUsername, role } = validated;
        const roleId = await getRoleId(role);
        if (!roleId) {
            throw new BadRequestError("Role not found");
        }
        // Check if the user is already a member of the team
        const existingUser = await getUserByEmail(emailOrUsername);
        if (existingUser) {
            const existingMember = await getTeamMember(teamId, existingUser.id);
            if (existingMember) {
                throw new ConflictError("User is already a member of this team");
            };
        }


        // Check if there's an existing, unexpired invitation
        const existingInvitation = await getTeamInvitation(teamId, emailOrUsername);
        if (existingInvitation && existingInvitation.expiresAt > new Date()) {
            throw new ConflictError("An invitation has already been sent to this email");
        }

        // If there's an expired invitation, delete it
        if (existingInvitation) {
            await deleteTeamInvitation(existingInvitation.id);
        }

        // Create new invitation
        const invitation = await createTeamInvitation({
            teamId,
            inviteeEmail: emailOrUsername,
            inviterId: user.id,
            roleId: roleId,
            token: crypto.randomUUID(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
        });

        // Send invitation email
        // await sendEmail(invitation.token, invitation.inviteeEmail);

        revalidatePath(`/teams/${teamId}`);
        return okRes("Invitation sent successfully");
    } catch (error) {
        return noRes(error);
    }
}

// toggle team status
export async function toggleTeamStatusAction(prevState: any, formData: FormData): Promise<ActionResponse> {

    try {
        const validated = z.object({
            id: z.string().min(3, "Team ID is required"),
        }).parse({
            id: formData.get("id"),
        });
        const team = await getTeam(validated.id);
        if (!team) {
            throw new BadRequestError("Team not found");
        }
        await updateTeam(validated.id, { disabled: !team.disabled });
        revalidatePath(`/teams/${validated.id}`);
        return okRes(`Team ${team.disabled ? "enabled" : "disabled"} successfully`);
    } catch (error) {
        return noRes(error);
    }
}