import { ThumbsUpIcon } from 'lucide-react';
import React from 'react';

const CommentSection: React.FC<{ videoId: string }> = ({ videoId }) => {
    // In a real application, you'd fetch comments based on the videoId
    const comments = [
        { id: 1, user: 'User1', text: 'Great video!', likes: 10 },
        { id: 2, user: 'User2', text: 'Very informative, thanks!', likes: 5 },
    ];

    return (
        <div className="mt-8">
            <h2 className="font-semibold text-muted-foreground mb-2">Comments</h2>
            <div className="space-y-4 flex flex-col gap-2">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                        <div className="w-8 h-8 bg-muted-foreground rounded-full"></div>
                        <div className="flex flex-col gap-1">
                            <p className="font-medium text-sm text-muted-foreground">{comment.user}</p>
                            <p className="text-sm text-primary">{comment.text}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <button className="text-sm text-muted-foreground flex items-center gap-1">
                                    <ThumbsUpIcon className="w-4 h-4" />
                                    {comment.likes}
                                </button>
                                <button className="text-sm text-muted-foreground">Reply</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
