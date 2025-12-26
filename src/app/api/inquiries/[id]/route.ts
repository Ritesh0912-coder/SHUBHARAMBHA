import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { status } = body;

        const inquiry = await prisma.inquiry.update({
            where: { id: id },
            data: { status },
        });

        return NextResponse.json(inquiry);
    } catch (error) {
        console.error("Failed to update inquiry:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.inquiry.delete({
            where: { id: id },
        });
        return NextResponse.json({ message: "Inquiry deleted successfully" });
    } catch (error) {
        console.error("Failed to delete inquiry:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
