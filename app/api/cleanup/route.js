import { NextResponse } from "next/server";
import db from "@/lib/db/db";

export const GET = async (request) => {

    const secret = request.headers.get("x-cron-secret");
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await db.query(`
            DELETE FROM cover_letters
            WHERE createdat < NOW() - INTERVAL '10 days'
        `);

        return NextResponse.json({
            message: `Deleted ${result.rowCount} expired cover letters`
        })
    } catch (error) {
        console.error("Cleanup failed:", error);
        return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
    }
}