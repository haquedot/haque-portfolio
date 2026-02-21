import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";

// POST /api/auth/setup - Create the first admin account (only works if no admin exists)
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Only allow setup if no admins exist
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin account already exists. Use login instead." },
        { status: 403 }
      );
    }

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
      name,
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An admin with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/auth/setup - Check if setup is needed
export async function GET() {
  try {
    await connectToDatabase();
    const existingAdmin = await Admin.findOne();
    return NextResponse.json({
      needsSetup: !existingAdmin,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
