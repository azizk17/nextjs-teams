import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TranscriptTabs: React.FC<{ videoId: string }> = ({ videoId }) => {
    // In a real application, you'd fetch transcript and summary based on the videoId
    const transcript = "This is the full transcript of the video...";
    const summary = "This is a brief summary of the video content...";

    return (
        <div className="mt-8">
            <Tabs defaultValue="transcript" className="w-full">
                <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-primary">{summary}</p>
                    </div>
                </TabsContent>
                <TabsContent value="transcript">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-primary">{transcript}</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TranscriptTabs;
