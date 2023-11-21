'use client';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


interface PostData {
    userid: string;
    username: string;
    title: string;
    content: string;
}

export default function Edit(props : PostData){
    const [formData, setFormData] = useState<PostData>()  
    console.log(formData)
    const params = useParams();
    useEffect(()=>{
        const fetchData = async () =>{
            const res = await fetch(`/api/edit?id=${params.id}`)
            const data = await res.json();
            setFormData(data.result)
        }
       fetchData()
    },[params.id])

    const editPost = async (e: number) =>{
        //alert(e) > 현재 포스트 아이디값
    
        try{
            const res = await fetch(`/api/edit/`,{
              method: 'POST',
              headers: {
                'Content-Type' : 'application/json'
              },
              body: JSON.stringify(formData)
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
        <form method="post" >
        <input type="text"  className="shadow text-gray-700 text-sm mb-2 border" />
        <input type="text" className="shadow text-gray-700 text-sm mb-2 border" name="title" />
        <textarea name="content" className="shadow text-gray-700 text-sm mb-2 border" ></textarea>
        <Link href="/" className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 focus:outline-none">취소</Link>
        <button className="bg-orange-500 text-white px-4 py-2 rounded shadow-md hover:bg-orange-600 focus:outline-none mr-1" onClick={()=>{editPost}}>수정</button>
      </form>
        </>
    )
}