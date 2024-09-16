import { eq } from "drizzle-orm";
import { permissionsTable, rolePermissionsTable, rolesTable } from "../schema";
import db from "..";

export const roles = [
  { id: 1, name: 'Super Admin', description: 'Highest level of access with system-wide control' },
  { id: 2, name: 'Admin', description: 'High-level management access' },
  { id: 3, name: 'Owner', description: 'Full control over the channel and app settings' },
  { id: 4, name: 'Publisher', description: 'Reviews and approves content' },
  { id: 5, name: 'Editor', description: 'Can create and edit videos' },
  { id: 6, name: 'Creator', description: 'Can upload raw footage and create video drafts' },
  { id: 7, name: 'Moderator', description: 'Manages comments and community engagement' },
  { id: 8, name: 'Analyst', description: 'Access to analytics and reporting tools' },
  { id: 9, name: 'Viewer', description: 'Can only view content and basic analytics' },

]

export const permissions = [
  { id: 1, name: 'create_content', description: 'Can create new content' },
  { id: 2, name: 'edit_content', description: 'Can edit existing content' },
  { id: 3, name: 'approve_content', description: 'Can approve content for publishing' },
  { id: 4, name: 'publish_content', description: 'Can publish approved content' },
  { id: 5, name: 'manage_users', description: 'Can manage user accounts' },
  { id: 6, name: 'view_analytics', description: 'Can view analytics data' },
  { id: 7, name: 'moderate_comments', description: 'Can moderate user comments' },
]

export const rolePermissions = [
  { role: "Super Admin", permissions: ['create_content', 'edit_content', 'approve_content', 'publish_content', 'manage_users', 'view_analytics', 'moderate_comments'] },
  { role: 'Admin', permissions: ['create_content', 'edit_content', 'approve_content', 'publish_content', 'manage_users', 'view_analytics', 'moderate_comments'] },
  { role: 'Owner', permissions: ['create_content', 'edit_content', 'approve_content', 'publish_content', 'manage_users', 'view_analytics', 'moderate_comments'] },
  { role: 'Publisher', permissions: ['approve_content', 'publish_content', 'view_analytics'] },
  { role: 'Editor', permissions: ['create_content', 'edit_content'] },
  { role: 'Creator', permissions: ['create_content'] },
  { role: 'Moderator', permissions: ['moderate_comments'] },
  { role: 'Analyst', permissions: ['view_analytics'] },
  { role: 'Viewer', permissions: [] },
]

export async function seed() {
  // Insert roles
  await db.insert(rolesTable).values(roles.map(role => ({
    name: role.name,
    description: role.description
  }))).onConflictDoNothing();

  console.log('Roles inserted');

  // Insert permissions
  await db.insert(permissionsTable).values(permissions.map(permission => ({
    name: permission.name,
    description: permission.description
  }))).onConflictDoNothing();

  console.log('Permissions inserted');

  // Insert role permissions
  for (const rp of rolePermissions) {
    const role = await db.select().from(rolesTable).where(eq(rolesTable.name, rp.role)).limit(1);
    if (role.length === 0) continue;

    for (const permissionName of rp.permissions) {
      const permission = await db.select().from(permissionsTable).where(eq(permissionsTable.name, permissionName)).limit(1);
      if (permission.length === 0) continue;

      await db.insert(rolePermissionsTable).values({
        roleId: role[0].id,
        permissionId: permission[0].id
      }).onConflictDoNothing();
    }
  }

  console.log('Role permissions inserted');
}