import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getUserTeams } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Package2 } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = "1";
  // const teams = await getUserTeams(userId);
  const teams = []
  const channels: any[] = []
  // const channels = await getUserChannels(teams[0].teamId);

  return (
    <html lang="en" >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          // enableSystem
          disableTransitionOnChange
        >

          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r border-accent bg-background md:block">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b border-muted px-4 lg:h-[60px] lg:px-6">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6" />
                    <span className="">NextJS Teams</span>
                  </Link>
                </div>
                <div className="flex-1">
                  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <Link href="/projects" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                      Projects
                    </Link>
                    <Link href="/teams"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                      Teams
                    </Link>



                  </nav>
                </div>
                <div className="mt-auto p-4">
                  <Button>
                    Logout
                  </Button>
                </div>



              </div>
              {/* Main content */}
            </div>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
              {children}
            </main>
            <Toaster />

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
