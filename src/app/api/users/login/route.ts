import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }
        console.log("User exists");
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Password invalid");
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });
        if (!token) {
            console.log("Token not generated");
            return NextResponse.json({ error: "Token not generated" }, { status: 400 });
        }

        console.log("User Logged in successfully. Token: ", token);

        const response = NextResponse.json({ message: "User logged in successfully" }, { status: 200 });
        response.cookies.set("token", token);
        return response;
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}