import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const education = await db.education.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json(
      { error: "Failed to fetch education" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.degree || !body.institution || !body.startYear) {
      return NextResponse.json(
        { error: "Degree, institution, and start year are required" },
        { status: 400 }
      );
    }

    const education = await db.education.create({
      data: {
        degree: body.degree,
        institution: body.institution,
        field: body.field ?? "",
        startYear: body.startYear,
        endYear: body.endYear ?? "",
        grade: body.grade ?? "",
        description: body.description ?? "",
        logoUrl: body.logoUrl ?? "",
        order: body.order ?? 0,
      },
    });

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json(
      { error: "Failed to create education" },
      { status: 500 }
    );
  }
}
