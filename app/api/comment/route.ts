import { NextRequest, NextResponse } from "next/server";
import db from '@/db';
import { RowDataPacket } from "mysql2";

interface PostData {
    parentid: number;
    userid : string;
    username : string;
    content: string;
}
export const POST = async (
    req: NextRequest
) : Promise<NextResponse> =>{
    if(req.method === 'POST'){
    try{
        const { parentid, userid, username, content } : PostData = JSON.parse(await req.text());
        console.log(parentid, userid ,username, content)

        if(!parentid || !userid || !username || !content){
            return NextResponse.json({message: "데이터가 부족합니다."})
        }else{
            await db.query<RowDataPacket[]>
            ('insert into board.comment (parentid, userid, username, content)  values(?,?,?,?)', [parentid,userid, username, content])
            const [datas] = await db.query<RowDataPacket[]>('select * from board.comment where parentid = ? ORDER BY date DESC' , [parentid])
            return NextResponse.json({message: "성공", result: datas})
           
        }
       
    }catch(error){
        return NextResponse.json({error: error})
    }
       
    }
    return NextResponse.json({error: "정상적인 데이터가 아닙니다."})
}


export const GET = async (
    req:NextRequest 
) : Promise<NextResponse> =>{
    if(req.method === 'GET'){

        try{
            const parentid = req.nextUrl.searchParams.get("id");
            console.log(parentid);

            const [results] = await db.query<RowDataPacket[]>
            ('select * from board.comment where parentid = ? ORDER BY date DESC',[parentid])
            return NextResponse.json({message: "성공", result: results})

        }catch(error){
            return NextResponse.json({error: error})
        }

    }else{
        return NextResponse.json({error: "정상적인 데이터가 아닙니다."})
    }

   
}