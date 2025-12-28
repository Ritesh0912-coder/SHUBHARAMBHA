import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Database connection issue:", error);
        return NextResponse.json(
            { error: "Database connection failed: " + (error.message || "Unknown error") },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, price, image, benefits, description, usageMethod, category, isFeatured, suitableCrops, isVisible, isSpecialKit } = body;

        const product = await prisma.product.create({
            data: {
                name,
                price,
                image,
                benefits: Array.isArray(benefits) ? benefits : (typeof benefits === 'string' ? benefits.split(',').map(b => b.trim()).filter(Boolean) : []),
                description,
                usageMethod,
                category,
                isFeatured: isFeatured || false,
                suitableCrops: Array.isArray(suitableCrops) ? suitableCrops : (typeof suitableCrops === 'string' ? suitableCrops.split(',').map(s => s.trim()).filter(Boolean) : []),
                isVisible: isVisible !== false,
                isSpecialKit: isSpecialKit || false,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Failed to create product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

