import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Remove id and other metadata fields that should not be in the data block
        const { id: _id, createdAt, updatedAt, ...updateData } = body;

        const updatedGuidance = await prisma.cropGuidance.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedGuidance);
    } catch (error) {
        console.error("Error updating guidance:", error);
        return NextResponse.json({ error: "Failed to update guidance" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        await prisma.cropGuidance.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Guidance deleted successfully" });
    } catch (error) {
        console.error("Error deleting guidance:", error);
        return NextResponse.json({ error: "Failed to delete guidance" }, { status: 500 });
    }
}
