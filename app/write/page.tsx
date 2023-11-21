'use client';

interface formType {
  userid: string;
  username: string;
  title: string;
  content: string;
}
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCustomSession } from "../sessions";
import Edit from "../components/edit";


export default function Write(){

  const { data: session } = useCustomSession();
  console.log(session)

  const [formData, setFormData] = useState<formType>({
    userid: session?.user?.email ??'',
    username : session?.user?.name ?? '',           // ?? 는 조건문 사용할 경우 왼쪽것이 (참)으로 출력된다.
    title: '',
    content: ''
  })

  useEffect(()=>{
    setFormData({
      userid: session?.user.email ?? '',
      username: session?.user.name ?? '',
      title: '',
      content: '',
    })
  },[session?.user.name, session?.user.email])


  const changeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    setFormData({...formData, [e.target.name] : e.target.value});
    console.log(formData)
  }

  const submitEvent = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try{
      const res = await fetch('/api/write',{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if(res.ok){
        const data = await res.json();
        console.log(data.message);
        alert("정상")
        window.location.href= "/"
      }else{
        const errorData = await res.json();
        console.log(errorData.error);
      }

    }catch(error){
      console.log(error);
    }
  }

  return (
    <>

      <form method="post" onSubmit={submitEvent} className="mt-10 flex flex-col max-w-7xl mx-auto">
        <div className="flex justify-center">
        <input type="text" name="name" value={session?.user.name??''} onChange={changeEvent} className="shadow text-gray-700 text-sm mb-2 border p-10" />
        <input type="text" className="shadow text-gray-700 text-sm mb-2 border p-20" name="title" onChange={changeEvent} defaultValue={formData.title} placeholder="게시글 타이틀을 입력해주세요"/>
        <textarea name="content" className="shadow text-gray-700 text-sm mb-2 border p-20" onChange={changeEvent} defaultValue={formData.content} placeholder="게시글 내용을 입력해주세요"></textarea>
        </div>
        <div className="flex justify-end w-full">
        <Link href="/" className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 focus:outline-none inline-block">취소</Link>
        <button className="bg-orange-500 text-white px-4 py-2 rounded shadow-md hover:bg-orange-600 focus:outline-none ">등록</button>
        </div>
      </form>
    </>
  )
}