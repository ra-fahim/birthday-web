'use client';
import React, { createContext, useContext } from 'react';
import type { BirthdayContent } from '@/lib/types';
export const ProposalContext = createContext<BirthdayContent | null>(null);
export function useProposalContent(){ return useContext(ProposalContext); }
