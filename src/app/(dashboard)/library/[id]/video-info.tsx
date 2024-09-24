import React from 'react';

const VideoInfo: React.FC<{ video: any }> = ({ video }) => {
    return (
        <div className="mt-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <div className="flex justify-between items-center mt-2">
                <p className="text-gray-600">{video.views} views • {video.uploadDate}</p>
            </div>
            <p className="mt-4">{video.description}</p>
        </div>
    );
};

export default VideoInfo;
