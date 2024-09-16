import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function Page() {
    return (
        <ContentLayout title={`Settings - General`}>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="projectName">Project Name</Label>
                                <Input id="projectName" placeholder="Enter project name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectDescription">Description</Label>
                                <Textarea id="projectDescription" placeholder="Describe your project" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectLogo">Project Logo</Label>
                                <Input id="projectLogo" type="file" />
                            </div>
                            <Button type="submit" >Update Basic Information</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="projectUrl">Project URL</Label>
                                <Input id="projectUrl" placeholder="https://example.com/project" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectVisibility">Visibility</Label>
                                <Select>
                                    <SelectTrigger id="projectVisibility">
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="projectStatus" />
                                <Label htmlFor="projectStatus">Project Active</Label>
                            </div>
                            <Button type="submit">Update Project Details</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Time and Language</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="defaultLanguage">Default Language</Label>
                                <Select>
                                    <SelectTrigger id="defaultLanguage">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeZone">Time Zone</Label>
                                <Select>
                                    <SelectTrigger id="timeZone">
                                        <SelectValue placeholder="Select time zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="utc">UTC</SelectItem>
                                        <SelectItem value="est">EST</SelectItem>
                                        <SelectItem value="pst">PST</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">Update Time and Language</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    );
}