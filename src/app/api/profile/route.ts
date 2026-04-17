import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    let profile = await db.profile.findFirst();

    if (!profile) {
      profile = await db.profile.create({
        data: {},
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const profile = await db.profile.findFirst();

    if (!profile) {
      const newProfile = await db.profile.create({
        data: body,
      });
      return NextResponse.json(newProfile, { status: 201 });
    }

    const updatedProfile = await db.profile.update({
      where: { id: profile.id },
      data: body,
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
