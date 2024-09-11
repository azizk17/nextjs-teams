/**
 * @jest-environment node
 */
import { describe, it, expect, vi, beforeEach, test } from 'vitest';
import * as auth from '@/auth';

describe('casbin', () => {
    it('should assign a user to a channel', async () => {
        expect(true).toBe(true);
    });

    it('should get user global roles', async () => {
        const user = await auth.user('0-0');
        const globalRoles = await auth.getUserGlobalRoles(user.id);
        console.log("Global Roles:", globalRoles);
        expect(globalRoles).toBeDefined();
    });


    it('should get user global permissions', async () => {
        const user = await auth.user('0-0');
        const globalPermissions = await auth.getUserGlobalPermissions(user.id);
        console.log("Global Permissions:", globalPermissions);
        expect(globalPermissions).toBeDefined();
    });
    it('should get user permissions by team id', async () => {
        const user = await auth.user('0-0');
        const teamId = '1';
        const permissions = await auth.getUserPermissionsByTeamId(user.id, teamId);
        console.log("Permissions by Team ID:", permissions);
        expect(permissions).toBeDefined();
    });

    it('should get user permissions by channel id', async () => {
        const user = await auth.user('OJk3lgwApBSBV6u8wzuIw');
        const channelId = '1';
        const permissions = await auth.getUserPermissionsByChannelId(user.id, channelId);
        console.log("Permissions by Channel ID:", permissions);
        expect(permissions).toBeDefined();
    });



    it('should check if a user has a role', async () => {
        expect(true).toBe(true);
    });
    it('shoud check if a user has a permission', async () => {
        const user = await auth.user('OJk3lgwApBSBV6u8wzuIw');
        console.log("Name:", user);
        const hasPermission = await auth.hasPermission(user.id, 'edit_user');
        expect(hasPermission).toBe(true);
    });
    it('should check if a user has a permission with a channel', async () => {
        expect(true).toBe(true);
    });

});

