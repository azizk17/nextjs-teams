import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileIcon, VideoIcon, ImageIcon, FileAudioIcon, AudioLines } from 'lucide-react';

const TypeIcon = ({ type }) => {
    switch (type) {
        case 'file':
            return <FileIcon className="w-4 h-4" />;
        case 'video':
            return <VideoIcon className="w-4 h-4" />;
        case 'image':
            return <ImageIcon className="w-4 h-4" />;
        case 'audio':
            return <AudioLines className="w-4 h-4" />;
        default:
            return null;
    }
};

const DataTable = ({ data }) => {
    return (
        <Table>
            {/* <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Published At</TableHead>
                </TableRow>
            </TableHeader> */}
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>
                            <div className="relative">
                                <div className="relative">
                                    <Avatar className="w-16 h-16 rounded-md">
                                        <AvatarImage src={item.thumbnailUrl} alt={item.title} />
                                        <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Badge variant="outline" className="bg-secondary bg-opacity-20 absolute -top-2 -left-2 text-xs rounded-full p-1">
                                        <TypeIcon type={item.type} />
                                    </Badge>
                                    {item.duration && (
                                        <Badge variant="secondary" className="absolute bottom-0 right-0 text-xs">
                                            {item.duration}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                        <TableCell className="max-w-xs truncate ">{item.content.description}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="text-xs">
                                <TypeIcon type={item.type} className="mr-1" />
                                {item.type}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="text-xs">{item.platform.name}</Badge>
                        </TableCell>
                        <TableCell>{item.author.name}</TableCell>
                        <TableCell>{new Date(item.publishedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default DataTable;