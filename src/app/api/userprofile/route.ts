import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(){
    const cookieStore = await cookies();
        const access = cookieStore.get('access')?.value;
         if(!access){
            return NextResponse.json(
                { error : "Unauthorised" },
                {   status : 401}
            );
        }
    try{
        

       

        const res = await axios.get(`http://127.0.0.1:8012/api/profile/me/`,
           {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
        );
        // console.log(res.data);
        return NextResponse.json(res.data);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}
    