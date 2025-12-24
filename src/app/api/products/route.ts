import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(products);
    } catch (error) {
        // Return empty array on connection error to allow static fallback
        console.warn("Database connection issue, using fallback mode:", error);
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, price, image, benefits, description, usageMethod, category, isFeatured } = body;

        const product = await prisma.product.create({
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

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Failed to create product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
