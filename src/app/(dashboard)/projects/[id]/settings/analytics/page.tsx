"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaChartBar, FaUsers, FaTasks, FaClock, FaFileExport } from "react-icons/fa"

// Assume we have chart components
import { BarChart, LineChart, PieChart } from "recharts"
import { ContentLayout } from "@/components/admin-panel/content-layout"

export default function AnalyticsSettings() {
    return (
        <ContentLayout title="Analytics">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Select defaultValue="last30days">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last7days">Last 7 days</SelectItem>
                            <SelectItem value="last30days">Last 30 days</SelectItem>
                            <SelectItem value="last3months">Last 3 months</SelectItem>
                            <SelectItem value="lastyear">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <FaFileExport className="mr-2" /> Export Data
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FaUsers className="mr-2" /> User Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart data={[]} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FaTasks className="mr-2" /> Task Completion
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BarChart data={[]} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FaClock className="mr-2" /> Time Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PieChart data={[]} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FaChartBar className="mr-2" /> Resource Utilization
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BarChart data={[]} />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">Active Users</h3>
                            <p className="text-2xl font-bold">1,234</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Tasks Completed</h3>
                            <p className="text-2xl font-bold">567</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Avg. Time per Task</h3>
                            <p className="text-2xl font-bold">2.5 hours</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Resource Efficiency</h3>
                            <p className="text-2xl font-bold">87%</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Custom Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <CardDescription>
                            Generate custom reports based on specific metrics and date ranges.
                        </CardDescription>
                        <Button>Create Custom Report</Button>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    )
}