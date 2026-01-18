import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req:Request){
    try{
       
        const cookieStore = await cookies();
        const access = cookieStore.get('access')?.value;
    if (!access) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
const res=await axios.get(
    'http://127.0.0.1:8005/api/groups/mygroup/',
    {
        headers:{
            Authorization: `Bearer ${access}`
        },
    }
    );
    return NextResponse.json(res.data)
    }catch(err:any){
        return NextResponse.json(
            {error:'Backend error'},
            { status: err.response?.status || 500 }
        );
    }

    

}