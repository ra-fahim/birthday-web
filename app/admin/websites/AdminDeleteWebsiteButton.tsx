'use client';
import { useRouter } from 'next/navigation';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
export default function AdminDeleteWebsiteButton({id}:{id:string}){const router=useRouter();return <DeleteConfirmModal label="Delete" title="Delete this website?" description="This admin action permanently removes the user's website and all attached media." onConfirm={async()=>{const r=await fetch(`/api/admin/websites/${id}`,{method:'DELETE'});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Could not delete website');router.refresh();}}/>}
