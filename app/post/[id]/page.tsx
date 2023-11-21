import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditDelete from '@/app/api/post/[id]/editDelete';
import Comment from '@/app/components/comment';
import Edit from '@/app/components/edit';
import db from '@/db';
import { RowDataPacket  } from 'mysql2';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

interface userInfo{
  user:{
    name: string;
    email?: string;
    image?: string;
    level?: number
  } 
}

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

// 데이터를 만들어 쏨

async function Getip(){ 
  const res = await fetch('http://localhost:3000/api/get-ip') //  '/'가 서버를 인식하지 못하여 주소전체를 입력하였다. 
  const data = res.json();
  if(!res.ok){
    alert("에러가 발생하였습니다.");
    return;
  }
  return data;
}



export default async function Detail({
  params
} : {
  params ?: {id?: number}
}){
  const getIp = await Getip();
  const userIp = getIp.data
  console.log(getIp)
//Get ip 함수 실행 버튼을 만들었다 getip변수에 담았음.


  const postId = params?.id !== undefined ? params.id : 1;
  const [results] = await db.query<RowDataPacket[]>('select * from board.board where id =?', [postId])
  const post = results && results[0]
  let session = await getServerSession(authOptions) as userInfo;
  const [countResult] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.view_log where postid = ? and ip_address =?',[postId, userIp]);
  const totalCnt = countResult[0].cnt
  console.log(totalCnt+"개")


  if(results.length > 0){

    if(totalCnt === 0){
      await db.query<RowDataPacket[]>('update board.board set count = count + 1 where id = ?',[postId])
    }

    await db.query<RowDataPacket[]>('insert into board.view_log(postid, ip_address, view_date) select ?, ?, NOW() where not exists(select 1 from board.view_log where postid = ? and ip_address =?  and view_date > now() - interval 24 hour)',
    [postId, userIp, postId, userIp])


    /* select 1 존재 여부를 확인하기 위해 사용 > 1이라는 건 상수 값으로 실제 데이터는 중요하지 않으며, 존재 여부를 확인하기 위함
      내가 원하는 테이블에서 어떠한 조건 즉, and 까지 포함한 3가지 조건이 모두 총족하는 조건을 찾는다.
      어떠한 행동도 반환하지 않을 때만 참이 된다. 즉 3가지 조건이 모두 참일 때 혹은 데이터가 없을 때 쿼리가 싱행
    */ 
  }

    return(
        <>
            {
                results.length > 0 && (
                    <>
                    <div className="flex justify-center p-[2%] border-b max-w-7xl mx-auto ">
                    <p className="basis-1/6">제목 :{post?.title}</p>
                    <p className="basis-1/6">정보 :{post?.userid}</p>
                    <p className="basis-1/6">세션 :{session&&session.user.email === post?.userid ? '같음' : '다름'}</p>
                    <p className="basis-1/6">작성자:{post?.username}</p>
                    <p>조회수 : {post?.count}</p>
                    {
                      session ? <Comment id={post?.id} /> : <p className='block border p-4 text-center my-5 rounded-md'><Link href="/login">로그인 이후 댓글을 작성할 수 있습니다.</Link></p>
                    }
                    </div>
                    <EditDelete results={post as propsType['results']}/>
                    </>
                ) 
            }
            
           
        </>
    )
}

// next.js는 서브페이지를 만들경우 새로운 폴더를 생성 후 [입력할 폴더]를 생성후 안에 page.tsx파일을 생성하면 된다.
// 주소창에 post / 작명(이 작명은 id 값이다. 즉 console창에 id = 입력한주소가 뜬다.)

// export const POST = async (req: NextRequest) : Promise<NextResponse> =>{
    
//     if(req.method === 'POST'){
//         return NextResponse.json({message: "메시지"})
//     }else{
//         return NextResponse.json({error: "에러메시지"})
//     }
// }

//데이터베이스 구현



