'use client';
import { useRouter } from 'next/navigation';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';

export default function DeleteWebsiteButton({ id }: { id: string }) {
  const router = useRouter();
  return <DeleteConfirmModal label="Delete" title="Delete this celebration website?" description="This removes the saved website and its live link from your workspace." onConfirm={async()=>{
    const r=await fetch(`/api/websites/${id}`,{method:'DELETE'});
    const j=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(j.error||'Could not delete this website.');
    router.refresh();
  }}/>;
}
