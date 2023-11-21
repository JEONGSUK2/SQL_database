import nextAuth from "next-auth";
import Github from "next-auth/providers/github";
import KakaoProvider from  "next-auth/providers/kakao";
import NaverProvider from  "next-auth/providers/naver";
import GoogleProvider from  "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '@/db';
import bcrypt from 'bcrypt';
import { RowDataPacket } from "mysql2";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface User{
    id: string;
    name: string;
    email: string;
    level: string;
    phone: string;
}

interface CustomSession extends Session{
    user?: User
}

export const authOptions :any = {
    providers : [
        Github({
            clientId:`${process.env.GITHUB_ID}`,
            clientSecret: `${process.env.GITHUB_PW}`         //env로 변경해서 써주기
        }),
        KakaoProvider({
            clientId:`${process.env.KAKAO_ID}`,                              //카카오톡 개발자 앱 설정-> 앱 키 -> Rest API KEY입력
            clientSecret: `${process.env.KAKAO_PW}`                          // 비밀번호는 카카오로그인 -> 보안 ->코드생성 후 -> 코드 복사해서 붙이기
        }),
        NaverProvider({
            clientId:`${process.env.NAVER_ID}`,                              //카카오톡 개발자 앱 설정-> 앱 키 -> Rest API KEY입력
            clientSecret: `${process.env.NAVER_PW}`                                    // 비밀번호는 카카오로그인 -> 보안 ->코드생성 후 -> 코드 복사해서 붙이기
        }),
        GoogleProvider({
            clientId:`${process.env.GOOGLE_ID}`,                                
            clientSecret:`${process.env.GOOGLE_PW}`                                  
        }),
        CredentialsProvider({
          
            name: "Credentials",
            credentials: {
              email: { label: "email", type: "text", placeholder: "email을 입력하세요" },
              password: { label: "Password", type: "password" },
              phone : {label : "phone", type: "text"}
            },
            async authorize(credentials) : Promise<User | null>{

                try{
                    const [results] = await db.query<RowDataPacket[]>('select * from board.member where email = ?', [credentials?.email]);
                    console.log(results[0].email)
                    const userResult = results[0]
                    if(!credentials || !credentials.email || !credentials.password || !credentials.phone){
                        return null
                    }
                    if(!results[0].email || !userResult.password){
                        console.log("해당 사용자가 없습니다.");
                        return null
                    }
                    const pwCheck = await bcrypt.compare(credentials.password , results[0].password);
                    
                    if(!pwCheck){
                        console.log("비밀번호 에러")
                        return null
                    }
                    const user:User = {
                        id : userResult.id,
                        name: userResult.name,
                        email: userResult.email,
                        level: userResult.level,
                        phone: userResult.phone
                    }             
                    return user;
                }catch(error){
                    return null
                }
            }})
    ],
    // pages: {
    //     signIn: '/login'
    // },

    // jwt 만료일 설정
    session : {
        strategy : 'jwt',
        maxAge: 24 * 60 * 60
    },
    // jwt 만들 때 실행 되는 코드 ( 토큰 발급 )
    callbacks : {
        jwt: async ({token, user} : {token:JWT , user?:User})=>{
            if(user){
                token.user ={
                    name: user.name,
                    email: user.email,
                    level : user.level,
                    phone: user.phone
                };
            }
            return token
        },
        session : async ({session,token} : {session: CustomSession, token: JWT})=>{
            session.user = token.user as User;
            return session
        }
    },
    secret: `${process.env.SECRET}`, //jwt 생성시 필요한 비밀번호
    
};


const handler = nextAuth(authOptions);
export { handler as GET, handler as POST}


