import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure cloudinary once
cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function POST(request: Request) {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = "shubharambha_uploads";

        // Get config to ensure we have the secret even if only CLOUDINARY_URL is set
        const config = cloudinary.config();

        if (!config.api_secret) {
            throw new Error("Cloudinary API Secret is missing");
        }

        // Generate signature
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: folder,
            },
            config.api_secret
        );

        return NextResponse.json({
            signature,
            timestamp,
            folder,
            cloud_name: config.cloud_name,
            api_key: config.api_key,
        });
    } catch (error: any) {
        console.error("Signature generation error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate signature" }, { status: 500 });
    }
}
