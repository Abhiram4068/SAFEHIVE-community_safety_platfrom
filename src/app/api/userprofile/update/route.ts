import { Cookie } from "next/font/google";
import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function PUT(){
    const cookieStore = await cookies();
    const access = cookieStore.get('access')?.value;
    if(!access){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        );
    }
    try{

    }
}