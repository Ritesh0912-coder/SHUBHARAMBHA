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
        const {
            name, name_hi, name_mr,
            price,
            image,
            benefits, benefits_hi, benefits_mr,
            description, description_hi, description_mr,
            usageMethod, usageMethod_hi, usageMethod_mr,
            category, category_hi, category_mr,
            isFeatured,
            suitableCrops, suitableCrops_hi, suitableCrops_mr,
            isVisible,
            isSpecialKit
        } = body;

        const product = await prisma.product.update({
            where: { id: id },
            data: {
                ...(name !== undefined && { name }),
                ...(name_hi !== undefined && { name_hi }),
                ...(name_mr !== undefined && { name_mr }),
                ...(price !== undefined && { price }),
                ...(image !== undefined && { image }),
                ...(benefits !== undefined && { benefits: Array.isArray(benefits) ? benefits : [] }),
                ...(benefits_hi !== undefined && { benefits_hi: Array.isArray(benefits_hi) ? benefits_hi : [] }),
                ...(benefits_mr !== undefined && { benefits_mr: Array.isArray(benefits_mr) ? benefits_mr : [] }),
                ...(description !== undefined && { description }),
                ...(description_hi !== undefined && { description_hi }),
                ...(description_mr !== undefined && { description_mr }),
                ...(usageMethod !== undefined && { usageMethod }),
                ...(usageMethod_hi !== undefined && { usageMethod_hi }),
                ...(usageMethod_mr !== undefined && { usageMethod_mr }),
                ...(category !== undefined && { category }),
                ...(category_hi !== undefined && { category_hi }),
                ...(category_mr !== undefined && { category_mr }),
                ...(isFeatured !== undefined && { isFeatured }),
                ...(suitableCrops !== undefined && {
                    suitableCrops: Array.isArray(suitableCrops) ? suitableCrops : (typeof suitableCrops === 'string' ? suitableCrops.split(',').map(s => s.trim()).filter(Boolean) : [])
                }),
                ...(suitableCrops_hi !== undefined && {
                    suitableCrops_hi: Array.isArray(suitableCrops_hi) ? suitableCrops_hi : (typeof suitableCrops_hi === 'string' ? suitableCrops_hi.split(',').map(s => s.trim()).filter(Boolean) : [])
                }),
                ...(suitableCrops_mr !== undefined && {
                    suitableCrops_mr: Array.isArray(suitableCrops_mr) ? suitableCrops_mr : (typeof suitableCrops_mr === 'string' ? suitableCrops_mr.split(',').map(s => s.trim()).filter(Boolean) : [])
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
