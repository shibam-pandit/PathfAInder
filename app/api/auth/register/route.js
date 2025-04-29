import { createUser, getUserByEmail } from "@/lib/services/auth.service";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (Request) => {
    const { name, email, password } = await Request.json();

    // Validate input
    if (!name || !email || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const userExists = await getUserByEmail(email);
    if (userExists) {
        return NextResponse.json({ message: "User Already Exists" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await createUser({ name, email, password: hashedPassword });
    if (!user) {
        return NextResponse.json({message: "Account Creation Failed"}, { status: 500 });
    }

    return NextResponse.json({ message: "User Created Successfully" }, { status: 201 });
}