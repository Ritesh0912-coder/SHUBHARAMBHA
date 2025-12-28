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
        const { name, price, image, benefits, description, usageMethod, category, isFeatured, suitableCrops, isVisible, isSpecialKit } = body;

        const product = await prisma.product.update({
            where: { id: id },
            data: {
                ...(name !== undefined && { name }),
                ...(price !== undefined && { price }),
                ...(image !== undefined && { image }),
                ...(benefits !== undefined && { benefits }),
                ...(description !== undefined && { description }),
                ...(usageMethod !== undefined && { usageMethod }),
                ...(category !== undefined && { category }),
                ...(isFeatured !== undefined && { isFeatured }),
                ...(suitableCrops !== undefined && {
                    suitableCrops: Array.isArray(suitableCrops)
                        ? suitableCrops
                        : (typeof suitableCrops === 'string'
                            ? suitableCrops.split(',').map(s => s.trim()).filter(Boolean)
                            : [])
                }),
                ...(isVisible !== undefined && { isVisible }),
                ...(isSpecialKit !== undefined && { isSpecialKit }),
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
