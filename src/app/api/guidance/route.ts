import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const guidance = await prisma.cropGuidance.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(guidance);
    } catch (error) {
        console.error("Error fetching guidance:", error);
        return NextResponse.json({ error: "Failed to fetch guidance" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid or empty JSON body" }, { status: 400 });
        }

        const { cropName, problems, solutions, usageMethod, advice, image } = body;

        if (!cropName || !problems || !solutions || !usageMethod || !advice) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newGuidance = await prisma.cropGuidance.create({
            data: {
                cropName,
                image,
                problems,
                solutions,
                usageMethod,
                advice,
            },
        });

        return NextResponse.json(newGuidance);
    } catch (error) {
        console.error("Error creating guidance:", error);
        return NextResponse.json({ error: "Failed to create guidance" }, { status: 500 });
    }
}
