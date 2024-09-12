import { eq } from "drizzle-orm";
import { permissionsTable, rolePermissionsTable, rolesTable } from "../schema";
import db from "..";

const roles = [
    { name: 'Owner', description: 'Full control over the channel and app settings' },
    { name: 'Admin', description: 'High-level management access' },
    { name: 'Publisher', description: 'Reviews and approves content' },
    { name: 'Editor', description: 'Can create and edit videos' },
    { name: 'Creator', description: 'Can upload raw footage and create video drafts' },
    { name: 'Moderator', description: 'Manages comments and community engagement' },
    { name: 'Analyst', description: 'Access to analytics and reporting tools' },
    { name: 'Viewer', description: 'Can only view content and basic analytics' },
  ]
  
  const permissions = [
    { name: 'create_content', description: 'Can create new content' },
    { name: 'edit_content', description: 'Can edit existing content' },
    { name: 'approve_content', description: 'Can approve content for publishing' },
    { name: 'publish_content', description: 'Can publish approved content' },
    { name: 'manage_users', description: 'Can manage user accounts' },
    { name: 'view_analytics', description: 'Can view analytics data' },
    { name: 'moderate_comments', description: 'Can moderate user comments' },
  ]
  
  const rolePermissions = [
    { role: 'Owner', permissions: ['create_content', 'edit_content', 'approve_content', 'publish_content', 'manage_users', 'view_analytics', 'moderate_comments'] },
    { role: 'Admin', permissions: ['create_content', 'edit_content', 'approve_content', 'publish_content', 'manage_users', 'view_analytics', 'moderate_comments'] },
    { role: 'Publisher', permissions: ['approve_content', 'publish_content', 'view_analytics'] },
    { role: 'Editor', permissions: ['create_content', 'edit_content'] },
    { role: 'Creator', permissions: ['create_content'] },
    { role: 'Moderator', permissions: ['moderate_comments'] },
    { role: 'Analyst', permissions: ['view_analytics'] },
    { role: 'Viewer', permissions: [] },
  ]

  export async function seed(){
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