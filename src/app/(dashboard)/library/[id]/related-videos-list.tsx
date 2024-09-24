import React from 'react';
import Link from 'next/link';

const RelatedVideosList: React.FC<{ videos: any[] }> = ({ videos }) => {
    return (
        <div className="flex flex-col gap-0">
            <h2 className="text-xl font-bold mb-0.5">Related Videos</h2>
            {videos.map((video) => (
                <Link href={`/library/${video.id}`} key={video.id} className="flex gap-0.5 hover:bg-muted p-1 rounded-md">
                    <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded-md" />
                    <div className="flex flex-col gap-0.5">
                        <h3 className="font-semibold text-sm">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.views} views</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default RelatedVideosList;
