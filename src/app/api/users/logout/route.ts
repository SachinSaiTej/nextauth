import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

connect();

export async function GET(request: NextRequest) {
    try {
        const response = NextResponse.json({ message: "User logged out successfully" }, { status: 200 });;
        response.cookies.delete("token");
        return response;
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}