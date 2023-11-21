import db from '@/db';
import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket  } from 'mysql2/promise';

export const GET = async (req:NextRequest) :
Promise<NextResponse> => {
    
    const pathname = req.nextUrl.pathname;                 // Url을 담은 변수 {message: '/api/post/3'} 데이터가 출력
    const postId = pathname.split('/').pop()              //pop은 배열의 마지막 번호만 출력하게 해준다.  split은 배열을 나누는 기능

    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM board.board where id = ?;',[postId])      // ? 문법 꼭 기억하기 어떠한 데이터를 출력할 때

    return NextResponse.json({data:results})            
    
}

//database - where 필드 값 = 변수