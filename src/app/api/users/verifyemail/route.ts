import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json();
        console.log(reqBody);
        const { token } = reqBody;
        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: new Date()}});

        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }
        console.log("user", user);
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({ message: "User verified successfully" }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}