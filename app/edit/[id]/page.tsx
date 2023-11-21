
'use client';


interface PostList {
    id: number;
    title: string;
    content: string;
    userid: string;
    username: string;
    date: string;
    count: number
}

import Comment from "@/app/components/comment";
import { useCustomSession } from "@/app/sessions";
import { useParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import React, {useEffect, useState} from 'react';
import Link from 'next/link'




export default function Edit(){
    const {data: session} = useCustomSession();
    const params = useParams();
    const [post, setPost] = useState<PostList[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)


const editPost = async (e: number) =>{
    //alert(e) > 현재 포스트 아이디값

    try{
        const res = await fetch(`/api/edit/`,{
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({id:e})
        })
        if(res.ok){
          const data = await res.json();
          console.log(data.message);
       
        }else{
          const errorData = await res.json();
          console.log(errorData.error);
        }
  
      }catch(error){
        console.log(error);
      }
  }

    return(
        <>
            {
                post.length > 0 && (
                    <>
                    <p>작성자 :{post[0]?.title}</p>
                    <p>정보 :{post[0]?.userid}</p>
                    <p>세션 :{session&&session.user.email === post[0]?.userid ? '같음' : '다름'}</p>
                    <p>타이틀:{post[0]?.username}</p>
                    {
                      session ? <Comment id={post && post[0]?.id}/> : <p className="block border p-4 text-center my-5 rounded-md"><Link href="/login">님아 로그인하셈</Link></p>
                    }
                    </>
                ) 
            }
            {
              session && session.user && (
                (post && post[0] && session.user.email === post[0]?.userid) || session.user.level === 10 ) &&
              <>  
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum animi, quis eligendi numquam optio repudiandae culpa dolor! Iusto ratione sint vero quaerat et doloribus, obcaecati laudantium cumque quae dolorem laboriosam?
              
              </>
            }
        </>
    )
}

// next.js는 서브페이지를 만들경우 새로운 폴더를 생성 후 [입력할 폴더]를 생성후 안에 page.tsx파일을 생성하면 된다.
// 주소창에 post / 작명(이 작명은 id 값이다. 즉 console창에 id = 입력한주소가 뜬다.)

export const POST = async (req: NextRequest) : Promise<NextResponse> =>{
    
    if(req.method === 'POST'){
        return NextResponse.json({message: "메시지"})
    }else{
        return NextResponse.json({error: "에러메시지"})
    }
}

//데이터베이스 구현


