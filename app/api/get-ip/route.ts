import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) : Promise<NextResponse> =>{
    if(req.method === 'GET'){
        const ip = req.headers.get("x-forwarded-for")
       
        return NextResponse.json({data: ip})
    }else{
        return NextResponse.json({error: "에러가 발생하였습니다."})
    }  
 }


 //페이지에 데이터출력