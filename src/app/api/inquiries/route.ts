import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error("Failed to fetch inquiries:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { farmerName, phone, crop, district, product } = body;

        const inquiry = await prisma.inquiry.create({
            data: {
                farmerName,
                phone,
                crop,
                district,
                product,
            },
        });

        return NextResponse.json(inquiry, { status: 201 });
    } catch (error) {
        console.error("Failed to create inquiry:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
