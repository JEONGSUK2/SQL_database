import { NextRequest, NextResponse } from "next/server";
import db from '@/db'

interface PostData {
    userid: string;
    username: string;
    title: string;
    content: string;
}

export const POST = async (
    req: NextRequest,
   
): Promise<NextResponse> =>{
    
    if(req.method === 'POST'){
        try{
            const { userid, username, title, content  }: PostData = JSON.parse(await req.text()); //JSON.parse 데이터가 변수안에 다들어감
            if(!userid || !username || !title ||  !content){
                return NextResponse.json({message: "데이터가 부족합니다."});
            }else{  
              const [results] = await db.query(
                    'insert into board.board (userid ,username, title, content) value (? ,?, ? ,?)',[userid,username,title,content]
                )
                return  NextResponse.json({message: "성공", result : results})
            }
           //정상적인 데이터를 처리하는 경우가 많다.

        }catch(error){
            return NextResponse.json({error: "에러"});
        }
    }else{
        return NextResponse.json({error: "정상적인 데이터가 아닙니다."});
    }
}
