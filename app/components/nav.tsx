interface userInfo {
    user: {
      name: string;
      email?: string;
      image?: string;
      level?: number;
    }
  }



import Link from "next/link";
// import { useCustomSession } from "../sessions";
import { getServerSession } from 'next-auth';
import { authOptions } from "../api/auth/[...nextauth]/route";
import Logout from "./logout";
import Login from "./login";



export default async function Nav(){

    let session = await getServerSession(authOptions) as userInfo
    
    // const {data : session, status} = useCustomSession()

{
    session && session.user 
    ? 
    <>
        <p>{session && session.user?.name}님 반갑습니다.</p>
        <Logout/>
    </>

:
        <>
         <Link href="/register">회원가입</Link>
         <Login/>
        </>
}

    return(
        <>
        <div className="max-w-7xl flex justify-between mt-10 mx-auto border-b p-[2%]">
       {
        session && session.user.level === 10 ? '관리자' 
        :
        session && session.user !==null && <div className="mx-auto"><span className="font-bold text-4xl ">OO님의 등급은 "일반 회원" 입니다.</span> </div>
       }
      
        {session && session.user ? <Logout/>
        
        : 
     
        <>
         <Link href="/login">통합로그인</Link>
         <Link href="/register"> <p>회원가입</p></Link>
         <div className="flex max-w-7xl justify-around">
        {/* <button onClick={()=>{signIn('kakao')}}>카카오톡</button> 
        <button onClick={()=>{signIn('github')}}>깃허브</button> 
        <button onClick={()=>{signIn('naver')}}>네이버</button> 
        <button onClick={()=>{signIn('google')}}>구글</button>  */}
        </div>


        </>
        }
        </div>
        {/* 커스텀 마이징 하는방법은 함수안에 '원하는 사이트 입력' */}
        </>
    )
}
