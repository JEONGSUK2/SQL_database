
'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";

interface formType{
    email: string;
    password: string;
    name: string;
    phone: string;
}


export default  function Register(){
    const [formData, setFormData] = useState<formType>({
        email: '',
        password: '',
        name:'',
        phone:''
    })
    const [message, setMessage] = useState<string>("");

    const changeEvent = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({
            ...formData, [e.target.name] : e.target.value
        })
        console.log(formData)
    }
    const submitEvent = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            const res = await fetch('/api/auth/signup',{
                method : 'POST',
                headers: {
                    'Content-Type' : 'aplication/json'
                },
                body: JSON.stringify(formData)
            })
            if(res.ok){
                const data = await res.json();
                const result = data.data
                console.log(result)
                if(data.message === '성공'){
                    alert("회원가입이 완료 되었습니다.")
                    // window.location.href='/'
                    signIn('credentials', {
                        email: result.email,
                        password: result.password,
                        phone: result.phone,
                        callbackUrl: '/'
                    })
                }
                console.log(data)
                setMessage(data.message);
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <>
        <p>{message}</p>
        <form onSubmit={submitEvent}  method="POST">
            <input onChange={changeEvent} type="text" placeholder="이메일" name="email" required />
            <input onChange={changeEvent} type="password" placeholder="비밀번호" name="password" required />
            <input onChange={changeEvent} type="text" placeholder="이름" name="name" required />
            <input onChange={changeEvent} type="text" placeholder="전화번호를 입력해주세요" name="phone" required />
            <button type="submit">가입</button>
        </form>
        
        </>
    )
}