import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getMedia } from "@/services/mediaService";
import VideoPlayer from "@/components/video-player";
import RelatedVideosList from "./related-videos-list";
import VideoInfo from "./video-info";
import TranscriptTabs from "./transcript-tabs";
import { VideoActions } from "./video-actions";

export default async function LibraryItemPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const video = await getMedia(id);
    // const relatedVideos = await getRelatedMedia(id);

    console.log(video);
    const relatedVideos = [
        {
            id: "1",
            title: "Related Video 1",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            views: 1000,
        },
        {
            id: "2",
            title: "Related Video 2",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            views: 1000,
        },
    ];
    const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            type: 'video/mp4'
        }]
    };
    return (
        <ContentLayout title={video.title}>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3 flex flex-col gap-2">
                    <VideoPlayer options={videoJsOptions} className="video-player" />
                    <VideoActions video={video} />
                    <VideoInfo video={video} />
                    <TranscriptTabs videoId={id} />
                </div>
                <div className="lg:w-1/3">
                    <RelatedVideosList videos={relatedVideos} />
                </div>
            </div>
        </ContentLayout>
    );
}