import db from '@/db';
import { NextRequest, NextResponse } from 'next/server';
import {RowDataPacket} from 'mysql2/promise';


export const GET = async (
  req: NextRequest,

) : Promise<NextResponse> =>{

  if(req.method === 'GET'){
   
    const page = Number(req.nextUrl.searchParams.get("page") || 1);
    const perPage = 15;
    const offset = (page - 1) * perPage;

    try{
      const [results] = await db.query<RowDataPacket[]>('SELECT * FROM board.board order by date DESC limit ? offset ?', [perPage, offset]);
      const [countResult] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.board');
      const totalCnt = countResult[0].cnt;
   

      return NextResponse.json({message: "성공", results, totalCnt, page, perPage})

    }catch(error){
      return NextResponse.json({error : error})
    }
  }else{

    return NextResponse.json({error : "에러가 발생하였습니다."})
  }


}

