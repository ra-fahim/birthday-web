'use client';
import { useRouter } from 'next/navigation';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';

export default function DeleteAdminWebsiteButton({ id }: { id: string }) {
  const router = useRouter();
  return <DeleteConfirmModal label="Remove" title="Remove this user's website?" description="The website, its live link and all media attached to it will be permanently removed." onConfirm={async()=>{
    const r=await fetch(`/api/admin/websites/${id}`,{method:'DELETE'});
    const j=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(j.error||'Could not remove the website.');
    router.refresh();
  }}/>;
}
