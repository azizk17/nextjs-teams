"use client";
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@/app/styles/videojs-skin.css';

export type VideoPlayerProps = {
    options: videojs.PlayerOptions;
    // onReady: (player: videojs.Player) => void;
    className: string;
}
export const VideoPlayer = (props: VideoPlayerProps) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef<videojs.Player | null>(null);
    const { options, className } = props;

    React.useEffect(() => {

        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");

            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current?.appendChild(videoElement);

            const player: videojs.Player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                // onReady && onReady(player);
            });

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player: videojs.Player = playerRef.current;
            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player: videojs.Player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player className={className}>
            <div ref={videoRef} className="video-js vjs-custom-skin h-full w-full object-contain" />
        </div>
    );
}

export default VideoPlayer;