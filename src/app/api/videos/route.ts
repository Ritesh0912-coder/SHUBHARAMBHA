import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET all farmer videos
export async function GET() {
    try {
        const videos = await prisma.farmerVideo.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(videos);
    } catch (error: any) {
        console.error("Failed to fetch videos:", error);
        return NextResponse.json(
            { error: "Failed to fetch videos: " + (error.message || "Unknown error") },
            { status: 500 }
        );
    }
}

// POST - Create new farmer video
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, videoUrl, isYouTube, isVisible } = body;

        if (!title || !videoUrl) {
            return NextResponse.json(
                { error: "Title and video URL are required" },
                { status: 400 }
            );
        }

        const video = await prisma.farmerVideo.create({
            data: {
                title,
                videoUrl,
                isYouTube: isYouTube || false,
                isVisible: isVisible !== false,
            },
        });

        return NextResponse.json(video, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create video:", error);
        return NextResponse.json(
            { error: "Failed to create video" },
            { status: 500 }
        );
    }
}
