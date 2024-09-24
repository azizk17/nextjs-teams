import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button, buttonVariants } from "@/components/ui/button";

const tags = [
    "Relationship", "Shows", "Lipsync", "Daily Life", "Beauty Care", "Games", "Society",
    "Fashion", "Music", "Travel", "Food", "Sports", "Technology", "Movies"
];

export const TagBar = () => {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full  mx-auto "
        >
            <CarouselContent className="-ml-5 ">
                {tags.map((tag, index) => (
                    <CarouselItem key={index} className="pl-0 basis-auto">
                        <Button
                            variant={index === 0 ? "secondary" : "ghost"}
                            className="whitespace-nowrap text-sm text-muted-foreground"
                            size="sm"
                        >
                            {tag}
                        </Button>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-muted/80" />
            <CarouselNext className="right-0 bg-muted/80" />
        </Carousel>
    );
};

export default TagBar;