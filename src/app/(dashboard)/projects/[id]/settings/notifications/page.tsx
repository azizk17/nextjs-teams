import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function NotificationSettings() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Notification Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Notification Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <Switch id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="in-app-notifications">In-app Notifications</Label>
                        <Switch id="in-app-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <Switch id="push-notifications" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Task Activities</h3>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="task-created">Task Created</Label>
                            <Select defaultValue="instant">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instant">Instant</SelectItem>
                                    <SelectItem value="daily">Daily Digest</SelectItem>
                                    <SelectItem value="off">Off</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="task-assigned">Task Assigned to You</Label>
                            <Select defaultValue="instant">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instant">Instant</SelectItem>
                                    <SelectItem value="daily">Daily Digest</SelectItem>
                                    <SelectItem value="off">Off</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="task-completed">Task Completed</Label>
                            <Select defaultValue="daily">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instant">Instant</SelectItem>
                                    <SelectItem value="daily">Daily Digest</SelectItem>
                                    <SelectItem value="off">Off</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Project Activities</h3>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="project-update">Project Updates</Label>
                            <Select defaultValue="weekly">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instant">Instant</SelectItem>
                                    <SelectItem value="daily">Daily Digest</SelectItem>
                                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                                    <SelectItem value="off">Off</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="new-member">New Team Member Added</Label>
                            <Select defaultValue="instant">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instant">Instant</SelectItem>
                                    <SelectItem value="daily">Daily Digest</SelectItem>
                                    <SelectItem value="off">Off</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full">Save Notification Settings</Button>
        </div>
    )
}