
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import ChartCom from './chart';
//yarn add chart.js react-chartjs-2 다운 , chart.js사이트 참고





interface userInfo {
    user: {
    name: string;
    email?: string;
    image?: string;
    level?: number;
  }
}

export default async function Admin(){
   
    let sessions = await getServerSession(authOptions) as userInfo;
    console.log(sessions)

    if(!sessions && sessions || sessions?.user.level !== 10){
        return(
            <p>관리자만 접속 가능한 페이지입니다.</p>
        )
    }
    return(
        <>
        <p>관리자전용</p>     
        <ChartCom/>
        </>
        
    )
}