import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AccountPage() {
    return <ContentLayout title="Account">
        <Card>
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Manage your account settings here.

                </CardDescription>
            </CardHeader>
            <CardContent>
                <p> Some content here</p>
            </CardContent>
        </Card>
    </ContentLayout>
}
