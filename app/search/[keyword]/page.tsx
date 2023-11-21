import db from '@/db';
import { RowDataPacket } from 'mysql2';
import React from 'react';
import Link from 'next/link'




export default async function SearchResult({
    params
} : {
    params?: {keyword?: string}
}){
    const keywords = params?.keyword !== undefined ? params.keyword : "";
        const [results] = await db.query<RowDataPacket[]>('select * from board.board where title Like ?',[`%${decodeURIComponent(keywords)}%`])
    
    return(
       
        <div>
        <p>검색결과 : {decodeURIComponent(keywords)}</p>
        {results.length === 0 && <p>아무것도 없다.</p>}
        {results && results.length > 0 && results.map((e,i)=>{
            return(
                <>
                <div key={i}>
                    <Link href={`/post/${e.id}`}>
                        <p>{e.title}</p>
                    </Link>
                    <p>{e.content}</p>
                    <p>{e.userid}</p>
                </div>
                </>
            )
        })}
        </div>
    )
}