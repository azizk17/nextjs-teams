import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PermissionsSettings() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Permissions</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-2 mb-4">
                        <Input placeholder="New role name" className="flex-grow" />
                        <Button>Add Role</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Map through roles here */}
                            <TableRow>
                                <TableCell>Admin</TableCell>
                                <TableCell>Full access to all project features</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                    <Button variant="ghost" size="sm">Delete</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Permissions Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Permission</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead>Manager</TableHead>
                                <TableHead>Member</TableHead>
                                <TableHead>Viewer</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Map through permissions here */}
                            <TableRow>
                                <TableCell>View Project</TableCell>
                                <TableCell><Checkbox checked={true} /></TableCell>
                                <TableCell><Checkbox checked={true} /></TableCell>
                                <TableCell><Checkbox checked={true} /></TableCell>
                                <TableCell><Checkbox checked={true} /></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Edit Project</TableCell>
                                <TableCell><Checkbox checked={true} /></TableCell>
                                <TableCell><Checkbox checked={true} /></TableCell>
                                <TableCell><Checkbox checked={false} /></TableCell>
                                <TableCell><Checkbox checked={false} /></TableCell>
                            </TableRow>
                            {/* More permissions... */}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Custom Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <Input placeholder="Permission name" />
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select resource" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="projects">Projects</SelectItem>
                                <SelectItem value="tasks">Tasks</SelectItem>
                                <SelectItem value="files">Files</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="create">Create</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="update">Update</SelectItem>
                                <SelectItem value="delete">Delete</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit">Create Custom Permission</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}