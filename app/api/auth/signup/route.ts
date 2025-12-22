import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request): Promise<Response> {
  try {
    console.log("Signup request received");
    const { name, email, password } = await request.json();
    console.log("Signup data:", { name, email, passwordLength: password?.length });

    if (!name || !email || !password) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      console.log("Password too short");
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log("Checking if user exists:", email);
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    console.log("Hashing password");
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    console.log("Creating user");
    const result = createUser(name, email, passwordHash);
    console.log("User creation result:", result);
    
    if (!result.userId) {
      console.log("Failed to create user");
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    console.log("User created successfully:", result.userId);
    return NextResponse.json(
      { message: "User created successfully", userId: result.userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}