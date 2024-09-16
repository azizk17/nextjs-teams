// import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FaArchive, FaExclamationTriangle } from "react-icons/fa"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ContentLayout } from '@/components/admin-panel/content-layout'

export default function ArchiveProject() {
    // const [confirmArchive, setConfirmArchive] = useState(false)

    return (
        <ContentLayout title="Archive Project">
            <div className="space-y-6">
                <Alert variant="destructive">
                    <FaExclamationTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                        Archiving a project will make it inaccessible to team members. This action can be reversed.
                    </AlertDescription>
                </Alert>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FaArchive className="mr-2" /> Archive Project
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <CardDescription>
                            Archiving this project will:
                            <ul className="list-disc list-inside mt-2">
                                <li>Remove it from active project lists</li>
                                <li>Prevent further modifications</li>
                                <li>Retain all project data for future reference</li>
                            </ul>
                        </CardDescription>

                        <div className="space-y-2">
                            <Label htmlFor="retention-period">Data Retention Period</Label>
                            <Select defaultValue="indefinite">
                                <SelectTrigger id="retention-period">
                                    <SelectValue placeholder="Select retention period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1year">1 Year</SelectItem>
                                    <SelectItem value="3years">3 Years</SelectItem>
                                    <SelectItem value="5years">5 Years</SelectItem>
                                    <SelectItem value="indefinite">Indefinite</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="confirm-archive"
                            // checked={confirmArchive}
                            // onCheckedChange={setConfirmArchive}
                            />
                            <Label htmlFor="confirm-archive">I understand the consequences of archiving this project</Label>
                        </div>

                        <Button
                            variant="destructive"
                            // disabled={!confirmArchive}
                            className="w-full"
                        >
                            Archive Project
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Reactivation Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            To reactivate an archived project:
                            <ol className="list-decimal list-inside mt-2">
                                <li>Go to the Archived Projects section</li>
                                <li>Select the project you want to reactivate</li>
                                <li>Click on the "Reactivate Project" button</li>
                                <li>Confirm the reactivation</li>
                            </ol>
                            Note: Reactivation will restore the project to its last active state.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    )
}