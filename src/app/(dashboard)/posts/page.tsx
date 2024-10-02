import { ContentLayout } from "@/components/admin-panel/content-layout";


import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Image from "next/image";



const posts = [
    { id: 1, title: "First Post", description: "This is the first post description...", thumb: "https://picsum.photos/200", platform: "facebook" },
    { id: 2, title: "Second Post", description: "This is the second post description...", thumb: "https://picsum.photos/201", platform: "twitter" },
    { id: 3, title: "Third Post", description: "This is the third post description...", thumb: "https://picsum.photos/202", platform: "instagram" },
    // Add more posts as needed
];

const PlatformIcon = ({ platform }) => {
    switch (platform) {
        case "facebook":
            return <FaFacebook className="h-5 w-5" />;
        case "twitter":
            return <FaTwitter className="h-5 w-5" />;
        case "instagram":
            return <FaInstagram className="h-5 w-5" />;
        default:
            return null;
    }
};

const PostCard = ({ post }: { post: any }) => (
    <Card className="w-full max-w-sm overflow-hidden">
        <div className="relative w-full h-48 ">
            <Image src={post.thumb} alt={post.title} fill className="w-full h-48 object-cover" />
        </div>
        <CardContent className="p-2">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-2">
            <PlatformIcon platform={post.platform} />
            <Button variant="outline" size="sm">View</Button>
        </CardFooter>
    </Card>
);

const PostsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {posts.map((post) => (
            <PostCard key={post.id} post={post} />
        ))}
    </div>
);

const Filters = () => (
    <div className="flex space-x-4 mb-6 text-sm justify-between">

        <Input placeholder="Search posts..." className="max-w-sm" />
        <div className="flex flex-col md:flex-row items-center space-x-2">

            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline">Apply Filters</Button>
        </div>
    </div >
);

const Actions = () => (
    <div className="flex justify-between items-center mb-6">
        <Button>Create New Post</Button>
        <Button variant="outline">Export Posts</Button>
    </div>
);
export default function PostsPage() {


    return <ContentLayout title="Posts">



        <div className="space-y-6">
            list all posts
            {/* <Actions />
            <Filters />
            <PostsGrid />
            <Pagination className="mt-6" /> */}
        </div>

    </ContentLayout>
}