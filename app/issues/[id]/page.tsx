'use client';

import { Suspense } from 'react';
import IssueDetailContent from './content';


export default function IssueDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Loading...</p></div>}>
      <IssueDetailContent />
    </Suspense>
  );
}