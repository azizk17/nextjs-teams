import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FaGithub, FaSlack, FaGoogle, FaJira, FaYoutube, FaTiktok, FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"
import { ContentLayout } from "@/components/admin-panel/content-layout"

const integrations = [
  {
    name: "GitHub",
    description: "Connect your GitHub repositories",
    icon: <FaGithub className="w-8 h-8" />,
    connected: true,
  },
  {
    name: "Slack",
    description: "Get notifications in your Slack channels",
    icon: <FaSlack className="w-8 h-8" />,
    connected: false,
  },
  {
    name: "Google Drive",
    description: "Access and share files from Google Drive",
    icon: <FaGoogle className="w-8 h-8" />,
    connected: true,
  },
  {
    name: "Jira",
    description: "Sync issues with Jira",
    icon: <FaJira className="w-8 h-8" />,
    connected: false,
  },
  {
    name: "YouTube",
    description: "Embed YouTube videos in your project",
    icon: <FaYoutube className="w-8 h-8" />,
    connected: false,
  },
  {
    name: "TikTok",
    description: "Embed TikTok videos in your project",
    icon: <FaTiktok className="w-8 h-8" />,
    connected: false,
  },
  {
    name: "Instagram",
    description: "Embed Instagram posts in your project",
    icon: <FaInstagram className="w-8 h-8" />,
    connected: false,
  },
  {
    name: "Facebook",
    description: "Embed Facebook posts in your project",
    icon: <FaFacebook className="w-8 h-8" />,
    connected: false,
  },
  {
    name: "Twitter",
    description: "Embed Twitter posts in your project",
    icon: <FaTwitter className="w-8 h-8" />,
    connected: false,
  },
  {
    name: "LinkedIn",
    description: "Embed LinkedIn posts in your project",
    icon: <FaLinkedin className="w-8 h-8" />,
    connected: false,
  },
]

export default function IntegrationsSettings() {
  return (
    <ContentLayout title="Integrations">
      <div className="space-y-6">
        {/* <h1 className="text-3xl font-bold">Integrations</h1> */}

        <div className="grid gap-6 md:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {integration.name}
                </CardTitle>
                {integration.icon}
              </CardHeader>
              <CardContent>
                <CardDescription>{integration.description}</CardDescription>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant={integration.connected ? "default" : "secondary"}>
                    {integration.connected ? "Connected" : "Disconnected"}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${integration.name}-toggle`}
                      checked={integration.connected}
                    />
                    <Label htmlFor={`${integration.name}-toggle`}>
                      {integration.connected ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
                <Button className="w-full mt-4" variant={integration.connected ? "destructive" : "secondary"}>
                  {integration.connected ? "Disconnect" : "Connect"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Custom Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Need a custom integration? Contact our support team to discuss your needs.
            </p>
            <Button variant="outline">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}