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
        const {
            name, name_hi, name_mr,
            price, price_hi, price_mr,
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

        const product = await prisma.product.create({
            data: {
                name, name_hi, name_mr,
                price, price_hi, price_mr,
                image,
                benefits: Array.isArray(benefits) ? benefits : (typeof benefits === 'string' ? benefits.split(',').map(b => b.trim()).filter(Boolean) : []),
                benefits_hi: Array.isArray(benefits_hi) ? benefits_hi : (typeof benefits_hi === 'string' ? benefits_hi.split(',').map(b => b.trim()).filter(Boolean) : []),
                benefits_mr: Array.isArray(benefits_mr) ? benefits_mr : (typeof benefits_mr === 'string' ? benefits_mr.split(',').map(b => b.trim()).filter(Boolean) : []),
                description, description_hi, description_mr,
                usageMethod, usageMethod_hi, usageMethod_mr,
                category, category_hi, category_mr,
                isFeatured: isFeatured || false,
                suitableCrops: Array.isArray(suitableCrops) ? suitableCrops : (typeof suitableCrops === 'string' ? suitableCrops.split(',').map(s => s.trim()).filter(Boolean) : []),
                suitableCrops_hi: Array.isArray(suitableCrops_hi) ? suitableCrops_hi : (typeof suitableCrops_hi === 'string' ? suitableCrops_hi.split(',').map(s => s.trim()).filter(Boolean) : []),
                suitableCrops_mr: Array.isArray(suitableCrops_mr) ? suitableCrops_mr : (typeof suitableCrops_mr === 'string' ? suitableCrops_mr.split(',').map(s => s.trim()).filter(Boolean) : []),
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

