'use client'
import {signIn} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCustomSession } from '../sessions';



interface userInfo{
    user:{
        name:string;
        email:any;
        password: string;
        level: number;
       
    }
}



export default function LoginPage() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {data: session} = useCustomSession();
    const[preUrl, setPreUrl] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    useEffect(()=>{
        if(typeof window !== 'undefined'){
            const prevPage = sessionStorage.getItem('preUrl') || '/';
                console.log(prevPage)
                setPreUrl(prevPage)
        }
    },[])


    const SignIn = () => {
      const credentials = {
        email: email,
        password: password,
        phone: phone
      };


            
    signIn('credentials', { ...credentials, callbackUrl: preUrl }); //로그인 성공했을때
    
       
    };

    if(session && session.user){
        return <p>이미 로그인함</p>  //컴포넌트로 변경해도 무방
    }

    return(
        <>
         { session && session.user.level === 10 
            ?
            '관리자'
            :
            session && session.user !== null && '일반회원'
        }

    
            <div className='flex justify-between w-full flex-wrap items-center py-48'>
                <div className='basis-9/12 sm:basis-7/12 md:basis-5/12 lg:basis-4/12 mx-auto'>
                    <div className='text-start'>
                        <p>이메일</p>
                        <input type="text" className='px-2 border border-l-orange-500 border-l-2 w-full focus:outline-gray-400 h-[50px] mx-auto' placeholder='example@naver.com'
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='text-start mt-3'>
                        <p>비밀번호</p>
                        <input type="password" className='px-2 border border-l-orange-500 border-l-2 h-[50px] w-full mx-auto focus:outline-gray-400' placeholder='비밀번호를 입력해주세요'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className='text-start mt-3'>
                        <p>전화번호</p>
                        <input type="text" className='px-2 border border-l-orange-500 border-l-2 h-[50px] w-full mx-auto focus:outline-gray-400' placeholder='전화번호를 입력해주세요'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                      <button className='basis-[48%] px-6 py-2.5 bg-gray-800 text-white font-medium text-base mt-2 leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out' onClick={SignIn}>로그인</button>
                      <button className='basis-[48%] px-6 py-2.5 bg-green-400 text-white font-medium text-base mt-2 leading-tight uppercase rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-500 active:shadow-lg transition duration-150 ease-in-out'><Link href="/register">회원가입</Link></button>

                    </div>
             
                <h3 className='text-xl font-bold mt-8 '>SNS 로그인</h3>
                <div className='w-full flex mb-7 justify-between'>
                    <button className='basis-1/5 mt-3 mx-auto py-2  text-white' onClick={()=>signIn('kakao')}>
                        <Image src='./sns/kakao_talk.svg' width={50} height={50} alt="naver" className='mx-auto' />
                    </button>
                    <button className='basis-1/5 mt-3 mx-auto py-2  text-white' onClick={()=>signIn('google')}>
                        <Image src='./sns/google.svg' width={50} height={50} alt="naver" className='mx-auto' />
                    </button>
                    <button className='basis-1/5 mt-3 mx-auto py-2  text-white ' onClick={()=>signIn('naver')}>
                        <Image src='./sns/naver.svg' width={50} height={50} alt="naver" className='mx-auto' />
                    </button>
                    <button className='basis-1/5 mt-3 mx-auto py-2  text-white ' onClick={()=>signIn('github')}>
                        <Image src='./sns/github-mark.svg' width={50} height={50} alt="naver" className='mx-auto' />
                    </button>
               
                    </div>
              </div>
            </div>
        </>
    )
};
