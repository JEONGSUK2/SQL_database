'use client'

import { useCustomSession } from "@/app/sessions"
import Link from "next/link";
import React, { Fragment } from "react";


interface propsType{
    results: {
      id: number;
      userid: string;
      title?: string;
      content?: string;
      username: string;
      count?: number;
      date? : string;
    }
  }

const deletePost = async(e:number) =>{
    try{
        const res = await fetch('/api/delete',{
            method : 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({id: e})
        })
        if(res.ok){
            alert("정상적으로 삭제 되었습니다.")
            window.location.href = "/"
        }else{
            alert("삭제 실패");
            return;
        }


    }catch(error){
        console.log(error)
    }
}

const editPost = async(e:number) => {
    try{
        const res = await fetch('/api/edit',{
            method: 'POST',
            headers : {
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({id: e})
        })
        if(res.ok){

        }else{
            alert("수정실패")
            return
        }
    }catch(error){
        console.log(error)
    }
}




export default function EditDelete({results} : propsType){
    const {data : session} = useCustomSession();
    return(
        <React.Fragment>
        {
              session && session.user && (
                (results && results && session.user.email === results?.userid) || session.user.level === 10 ) &&
              <>  
                <Link href="/edit/id"><button className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-orange-600 focus:outline-none mr-1">수정</button></Link>
                <button className="bg-orange-500 text-white px-4 py-2 rounded shadow-md hover:bg-orange-600 focus:outline-none mr-1" onClick={()=>{deletePost(results.id)}}>삭제</button>
              </>
            }


        
        </React.Fragment>
    )
}