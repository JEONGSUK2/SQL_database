import { NextRequest, NextResponse } from "next/server";
import db from '@/db'
import bcrypt from 'bcrypt';
import { RowDataPacket } from "mysql2";


interface formType{
    email: string;
    password: string;
    name: string;
    phone: string;
}


export const POST = async (
    req: NextRequest
) : Promise<NextResponse> =>{
    if(req.method === 'POST'){

        const {email, password, name, phone} : formType = JSON.parse(await req.text());

        if(!email || !password || !name || !phone){
            return NextResponse.json({message: "데이터가 부족합니다."})
        }

        const hash = await bcrypt.hash(password, 10);

        const [checkMember] = await db.query<RowDataPacket[] >('select  count(*) cnt from board.member where email = ?', [email])

       
        const memberCnt = checkMember[0].cnt;
        if(memberCnt > 0){
            return NextResponse.json({message: "해당 이메일이 존재합니다."})
        }else{
            await db.query('insert into board.member (email,password, name, phone) value(?,?,?,?)',[email, hash, name, phone])
            const data = {
                email: email,
                password: password,
                phone: phone
            }
            return NextResponse.json({message: "성공", data: data})
        }
    }else{
        return NextResponse.json({error: "실패"})
    }
}
