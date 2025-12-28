import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single video
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const video = await prisma.farmerVideo.findUnique({
            where: { id },
        });

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        return NextResponse.json(video);
    } catch (error: any) {
        console.error("Failed to fetch video:", error);
        return NextResponse.json(
            { error: "Failed to fetch video" },
            { status: 500 }
        );
    }
}

// PATCH - Update video
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, videoUrl, isYouTube, isVisible } = body;

        const video = await prisma.farmerVideo.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(videoUrl !== undefined && { videoUrl }),
                ...(isYouTube !== undefined && { isYouTube }),
                ...(isVisible !== undefined && { isVisible }),
            },
        });

        return NextResponse.json(video);
    } catch (error: any) {
        console.error("Failed to update video:", error);
        return NextResponse.json(
            { error: "Failed to update video" },
            { status: 500 }
        );
    }
}

// DELETE video
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.farmerVideo.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete video:", error);
        return NextResponse.json(
            { error: "Failed to delete video" },
            { status: 500 }
        );
    }
}
