import { ContentLayout } from "@/components/admin-panel/content-layout";


import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

import Image from "next/image";
import { getPosts } from "@/services/posts/postService";

export default async function PostsPage() {
    const data = await getPosts();
    return <ContentLayout title="Posts">

        <pre>{JSON.stringify(data, null, 2)}</pre>

    </ContentLayout>
}