import { YouTubeVideo, YouTubeChannel, YouTubeComment } from './youtube.interface';
import { Media, MediaType, MediaPlatform } from '@/types/media'; // Assuming you have these types defined

export function transformYouTubeVideoToMedia(video: YouTubeVideo, channel: YouTubeChannel): Media {
    return {
        id: video.id,
        title: video.title,
        description: video.description,
        publishedAt: new Date(video.publishedAt),
        thumbnailUrl: video.thumbnails.high.url,
        type: MediaType.VIDEO,
        platform: MediaPlatform.YOUTUBE,
        stats: {
            views: parseInt(video.statistics.viewCount),
            likes: parseInt(video.statistics.likeCount),
            comments: parseInt(video.statistics.commentCount),
        },
        author: {
            id: channel.id,
            name: channel.title,
            avatarUrl: channel.thumbnails.default.url,
            subscriberCount: parseInt(channel.statistics.subscriberCount),
        },
        url: `https://www.youtube.com/watch?v=${video.id}`,
    };
}

export function transformYouTubeCommentToMediaComment(comment: YouTubeComment): MediaComment {
    return {
        id: comment.id,
        content: comment.textDisplay,
        author: {
            name: comment.authorDisplayName,
            avatarUrl: comment.authorProfileImageUrl,
        },
        likes: comment.likeCount,
        createdAt: new Date(comment.publishedAt),
    };
}
