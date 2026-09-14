export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import {redirect} from 'next/navigation';import {getSessionUser,isApprovalRequired} from '@/lib/auth';import {db} from '@/lib/db';
export default async function New(){
  const u=await getSessionUser();if(!u)redirect('/login');
  if(u.role!=='admin' && !u.approved && await isApprovalRequired())redirect('/dashboard?pending=1');
  const s=await db.website.create({data:{userId:u.id,slug:`celebration-${Date.now()}`,title:'My Celebration Website',templateId:'master',content:{occasion:'birthday',templateId:'master'}}});
  redirect(`/builder/${s.id}`);
}
