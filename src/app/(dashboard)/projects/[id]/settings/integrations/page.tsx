import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FaGithub, FaSlack, FaGoogle, FaJira, FaYoutube, FaTiktok, FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaTelegram, FaDiscord } from "react-icons/fa"
import { ContentLayout } from "@/components/admin-panel/content-layout"

const integrations = [
  {
    name: "GitHub",
    description: "Connect your GitHub repositories",
    icon: <FaGithub className="w-8 h-8" />,
    connected: true,
  },
  {
    name: "OpenAI",
    description: "Integrate AI capabilities into your project",
    icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>,
    connected: false,
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
    name: "Telegram",
    description: "Connect your Telegram bot to your project",
    icon: <FaTelegram className="w-8 h-8" />,
    connected: false,
  },
  {
    name: "Discord",
    description: "Connect your Discord bot to your project",
    icon: <FaDiscord className="w-8 h-8" />,
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

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2  2xl:grid-cols-4">
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