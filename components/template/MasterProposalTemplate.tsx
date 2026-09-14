'use client';
import React from 'react';
import type { BirthdayContent } from '@/lib/types';
import OriginalMasterProposal from '@/components/master-proposal-original/App';
import { ProposalContext } from '@/components/master-proposal-original/ProposalContext';

export default function MasterProposalTemplate({ content }: { content: BirthdayContent }) {
  return <ProposalContext.Provider value={content}><OriginalMasterProposal /></ProposalContext.Provider>;
}
