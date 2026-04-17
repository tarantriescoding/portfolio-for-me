import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const experience = await db.experience.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.company || !body.position || !body.startDate) {
      return NextResponse.json(
        { error: "Company, position, and start date are required" },
        { status: 400 }
      );
    }

    const experience = await db.experience.create({
      data: {
        company: body.company,
        position: body.position,
        startDate: body.startDate,
        endDate: body.endDate ?? "",
        current: body.current ?? false,
        description: body.description ?? "",
        techStack: body.techStack ?? "[]",
        logoUrl: body.logoUrl ?? "",
        order: body.order ?? 0,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
