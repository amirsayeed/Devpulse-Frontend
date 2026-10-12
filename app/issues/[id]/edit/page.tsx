'use client';

import { Suspense } from 'react';
import EditIssueContent from './content';

export default function EditIssuePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Loading...</p></div>}>
      <EditIssueContent />
    </Suspense>
  );
}