
/*

const {data : session } = useCustomSession();

const data = {
    id: 5,
    name: "홍길동",
    email: "abcd@naver.com"
}
변수 내에 중괄호 {}가 들어가면 구조 분해 할당(destructuring assignment) 
> 해당 객체에서 그 속성을 추출해서 새로운 변수로 할당할 때 사용

예를 들어 ....data.id 이걸 변수로 저장 따로 하고 싶다면
const {id} = data > const id = 5 값이 저장된다.
data.id로 사용가능

*/

'use client';

import { useEffect, useState } from "react";
import { useCustomSession } from "../sessions";
import { useParams } from "next/dist/client/components/navigation";
import React, { Fragment } from "react";


interface CommentProps{
    id:number
}
interface formType {
    parentid : number;
    userid: string;
    username: string;
    content: string;
}
interface CommentType{
   
    id:number;
    parentid: number;
    userid: string;
    username: string;
    date : string;
}

export default function Comment(props:CommentProps ){
    
    const {id} = props;  //props로 넘긴 id값이 id라는 변수에 담겨 이제 id. ...으로 쓸수 있다.
  

    const commentValue = (e: React.ChangeEvent<HTMLInputElement>) =>{
        // setComment(e.target.value);
        setFormData({...formData, [e.target.name] : e.target.value});
        console.log(formData)
    }
   
    const {data : session } = useCustomSession();
    const [formData, setFormData] = useState<formType>({
        parentid : id,
        userid : session?.user?.email ?? '',
        username: session?.user?.name ?? '',
        content: ''
    })
    const [totalcomment, setTotalComment] = useState<CommentType[]>();

    const params = useParams();
    useEffect(()=>{
        const fetchData = async () =>{
            const res = await fetch(`/api/comment?id=${params.id}`)
            const data = await res.json();
            setTotalComment(data.result)
        }
       fetchData()
    },[])

    
  useEffect(()=>{
    setFormData({
      userid: session?.user.email ?? '',
      username: session?.user.name ?? '',
      parentid: id,
      content: '',
    })
  },[session?.user.name, session?.user.email,id])


    const cmtSubmit = async () =>{
        try{
            
            const res = await fetch('/api/comment',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(formData)

            })
            if(res.ok){
                const data = await res.json();
                console.log(data)
                setTotalComment(data.result)
            }

        }catch(error){
            console.log(error)
        }
    }    

    return(
        <>
        
        {
            session && session.user && <>
                
                {
                    totalcomment && totalcomment.map((e,i)=>{
                    const date = new Date(e.date); 
                    const year = date.getFullYear();
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0')
                    const hours = (date.getHours()+9).toString().padStart(2, '0')
                    const minutes = date.getMinutes().toString().padStart(2, '0')
                    const seconds = date.getSeconds().toString().padStart(2, '0')
                    const formatDate = `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`

                        return(
                            <React.Fragment key={i}>     
                           <p>{formatDate}</p>
                           <p>{formData.username}</p>
                            </React.Fragment>
                        )
                    })
                }
                <div className="flex mt-10 mx-auto max-w-7xl items-center justify-center">
                <p className="mr-4 font-bold">댓글을 입력해주세요.🖋</p>
                <input name="content" type="text" onChange={commentValue}  className="border p-2 border-orange-500 rounded"/>                      
                <button className="ml-4 border rounded-md bg-orange-500 p-5 font-bold text-white" onClick={cmtSubmit}> 전송</button>
                </div>
                
            </> 
        }
        </>
    )
}