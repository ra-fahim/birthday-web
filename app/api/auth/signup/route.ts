import {NextResponse} from 'next/server';
import {signupSchema} from '@/lib/validation';
import {supabaseRest} from '@/lib/supabase-rest';
import {setSessionCookie} from '@/lib/auth';
export const runtime='nodejs';
export async function POST(req:Request){try{
 const raw=await req.json(); const v=signupSchema.parse(raw); const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.json({error:'Supabase Auth is not configured'},{status:500});
 // No email verification: the account is created already-confirmed through the
 // Supabase admin API (service role), so Supabase never tries to send a
 // confirmation email (that send was what failed with "error sending confirmation email").
 const svc=process.env.SUPABASE_SERVICE_ROLE_KEY; const base=url.replace(/\/$/,'');
 if(!svc)return NextResponse.json({error:'Supabase server environment is not configured'},{status:500});
 const email=v.email.toLowerCase();
 const cr=await fetch(`${base}/auth/v1/admin/users`,{method:'POST',headers:{apikey:svc,Authorization:`Bearer ${svc}`,'Content-Type':'application/json'},body:JSON.stringify({email,password:v.password,email_confirm:true,user_metadata:{full_name:v.name}}),cache:'no-store'});
 const created=await cr.json().catch(()=>({}));
 if(!cr.ok){
  const code=String(created?.error_code||created?.code||''); const m=String(created?.msg||created?.message||'');
  if(code==='email_exists'||/already (been )?registered|already exists/i.test(m))return NextResponse.json({error:'An account with this email already exists. Please log in.'},{status:409});
  return NextResponse.json({error:m||'Unable to create account'},{status:cr.status});
 }
 // Sign in right away so the person lands in the app with a session.
 const lr=await fetch(`${base}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email,password:v.password}),cache:'no-store'});
 const session=await lr.json().catch(()=>({}));
 const data:any={user:created,session:lr.ok&&session?.access_token?session:null};

 // Member approval: admins and people who signed up through a valid invite
 // link skip the queue. Everyone else starts as pending — whether that
 // actually blocks them from building yet is decided at creation-time by
 // the admin's approval-system toggle, not here.
 const isAdmin=(process.env.ADMIN_EMAIL||'').trim().toLowerCase()===v.email.toLowerCase();
 let approved=isAdmin;
 if(!approved && typeof raw?.invite==='string' && raw.invite){
  const tok=await supabaseRest<any[]>(`settings?select=value&key=eq.signup_invite_token&limit=1`).catch(()=>[]);
  const expected=tok?.[0]?.value?.token;
  if(expected && expected===raw.invite) approved=true;
 }

 if(data?.user?.id) await supabaseRest('profiles',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:data.user.id,email:data.user.email,name:v.name,role:isAdmin?'admin':'user',approved})}).catch(()=>{});
 const response=NextResponse.json({ok:true,requiresEmailVerification:false});
 if(data.session?.access_token)setSessionCookie(response,data.session.access_token,data.session.refresh_token);
 return response;
}catch(e:any){return NextResponse.json({error:e?.issues?.[0]?.message||e?.message||'Invalid request'},{status:400})}}
