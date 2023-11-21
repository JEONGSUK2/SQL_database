import { headers } from 'next/headers'



export default async function NotFound(){
    
    const headerList = headers();
    const domain = headerList.get('referer');
    
    return(
        <>
       
        <p> {domain}은 없는 페이지 입니다.</p>
        </>
    )
}