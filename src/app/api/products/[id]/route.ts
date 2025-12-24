import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { name, price, image, benefits, description, usageMethod, category, isFeatured } = body;

        const product = await prisma.product.update({
            where: { id: id },
            data: {
                name,
                price,
                image,
                benefits,
                description,
                usageMethod,
                category,
                isFeatured,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Failed to update product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.product.delete({
            where: { id: id },
        });
        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Failed to delete product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
