import { google } from 'googleapis';

export interface YouTubeApiConfig {
    apiKey: string;
    oauthClientId: string;
    oauthClientSecret: string;
    redirectUri: string;
}

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
        default: { url: string; width: number; height: number };
        medium: { url: string; width: number; height: number };
        high: { url: string; width: number; height: number };
    };
    statistics: {
        viewCount: string;
        likeCount: string;
        commentCount: string;
    };
}

export interface YouTubeChannel {
    id: string;
    title: string;
    description: string;
    customUrl: string;
    thumbnails: {
        default: { url: string; width: number; height: number };
        medium: { url: string; width: number; height: number };
        high: { url: string; width: number; height: number };
    };
    statistics: {
        viewCount: string;
        subscriberCount: string;
        videoCount: string;
    };
}

export interface YouTubeComment {
    id: string;
    textDisplay: string;
    authorDisplayName: string;
    authorProfileImageUrl: string;
    likeCount: number;
    publishedAt: string;
}

// export interface YouTubeScrapedData {
//     videoTitle: string;
//     videoDescription: string;
//     viewCount: string;
//     likeCount: string;
//     commentCount: string;
//     uploadDate: string;
//     channelName: string;
//     channelSubscribers: string;
// }

export interface YouTubeService {
    initialize(config: YouTubeApiConfig): void;
    getVideoDetails(videoId: string): Promise<YouTubeVideo>;
    getChannelDetails(channelId: string): Promise<YouTubeChannel>;
    getVideoComments(videoId: string, maxResults?: number): Promise<YouTubeComment[]>;
    searchVideos(query: string, maxResults?: number): Promise<YouTubeVideo[]>;
    importVideo(videoId: string): Promise<void>;
}
