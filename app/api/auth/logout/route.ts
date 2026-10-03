import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {normalizeAppUrl} from '@/lib/app-url';
export async function GET(req:Request){
 const token=cookies().get('bb_session')?.value;
 if(token){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; if(url&&key) await fetch(`${url.replace(/\/$/,'')}/auth/v1/logout`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${token}`}}).catch(()=>{});}
 const r=NextResponse.redirect(new URL('/login',normalizeAppUrl(process.env.NEXT_PUBLIC_APP_URL)||new URL(req.url).origin));
 r.cookies.set('bb_session','',{httpOnly:true,path:'/',maxAge:0});r.cookies.set('bb_session_refresh','',{httpOnly:true,path:'/',maxAge:0});return r;
}
