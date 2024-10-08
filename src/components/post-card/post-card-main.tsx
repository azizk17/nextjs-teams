import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Media } from "@/db/schema";
import { PlayIcon, UserIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";


// video, image, images, text, audio, file, pdf
const renderContent = (item: Media) => {

    if (item.type === 'text') {

        return <p className="text-sm">{item.content}</p>;
    }
    if (item.type === 'image') {
        return (

            <Image
                src={item.thumbnailUrl}
                alt={item.title}
                height={400}
                width={400}
                className="object-contain"
            // onClick={() => openLightbox(item.imageUrl)}
            />

        );
    }
    if (item.type === 'video') {
        return (
            <div className="relative w-full h-48 w-48 overflow-hidden rounded-lg">
                <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    height={100}
                    width={100}
                    className="object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <button className="bg-black bg-opacity-50 text-white rounded-full p-3">
                        <PlayIcon />
                    </button>
                </div>
            </div>
        );
    }

};

type PostCardProps = {
    item: Media & {
        platform: {
            id: string;
            name: string;
        };
        author: {
            id: string;
            name: string;
            avatarUrl: string;
        };
    };
};
export default function PostCardMain({ item }: PostCardProps) {
    return (
        <Card>
            <CardContent className="flex flex-col gap-2 p-2">
                <div className="flex items-center justify-between w-full h-48 overflow-hidden rounded-lg bg-rose-800">
                    {renderContent(item)}
                </div>
                <p className="text-sm font-medium line-clamp-2 text-ellipsis">{item.title}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={item.author.avatarUrl} />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{item.author.name}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}