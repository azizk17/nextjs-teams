import React from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from '@/components/ui/card';

const RelatedVideosList: React.FC<{ videos: any[] }> = ({ videos }) => {
    return (
        <Card className='w-full'>
            <CardContent className='p-2'>
                <Tabs defaultValue="related" className="w-full">
                    <TabsList>
                        <TabsTrigger value="related">Related Videos</TabsTrigger>
                        <TabsTrigger value="clips">Clips</TabsTrigger>
                    </TabsList>
                    <TabsContent value="related">
                        <div className="flex flex-col  divide-y divide-muted">
                            {videos.map((video) => (
                                <Link href={`/library/${video.id}`} key={video.id} className="flex gap-2 hover:bg-muted p-2 rounded-md">
                                    <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded-md" />
                                    <div className="flex flex-col">
                                        <h3 className="font-semibold text-sm">{video.title}</h3>
                                        <p className="text-xs text-muted-foreground">{video.views} views</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="clips">
                        {/* Content for Clips tab */}
                        <div className="mt-4">Clips content goes here</div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default RelatedVideosList;
