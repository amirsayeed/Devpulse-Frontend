'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import { useIssues } from '@/hooks/useIssues';
import { Issue } from '@/lib/types';
import { ISSUE_TYPE_LABELS, ISSUE_STATUS_LABELS, STATUS_COLORS, TYPE_COLORS } from '@/lib/constants';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function IssueDetailContent() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const { user } = useAuthContext();
  const { fetchSingleIssue, deleteIssue, isLoading } = useIssues();
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch issue on mount
  useEffect(() => {
    const loadIssue = async () => {
      try {
        const data = await fetchSingleIssue(id);
        if (data) {
          setIssue(data);
        } else {
          setError('Issue not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load issue');
      }
    };

    loadIssue();
  }, [id, fetchSingleIssue]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteIssue(id);
      toast.success('Issue deleted successfully');
      window.location.href = '/issues';
    } catch (error) {
      toast.error('Failed to delete issue');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const canEdit = user?.role === 'maintainer' || user?.id === issue?.reporter.id;
  const canDelete = user?.role === 'maintainer';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/issues" className="text-blue-600 hover:underline">
            ← Back to Issues
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Issue Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading issue...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Issue Details */}
        {!isLoading && issue && (
          <div className="space-y-6">
            {/* Main Card */}
            <div className="bg-white rounded-lg shadow p-8">
              {/* Title & Badges */}
              <div className="mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-3xl font-bold text-gray-900 flex-1">
                    {issue.title}
                  </h2>
                  <div className="ml-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${TYPE_COLORS[issue.type as keyof typeof TYPE_COLORS]}`}>
                      {ISSUE_TYPE_LABELS[issue.type as keyof typeof ISSUE_TYPE_LABELS]}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${STATUS_COLORS[issue.status as keyof typeof STATUS_COLORS]}`}>
                      {ISSUE_STATUS_LABELS[issue.status as keyof typeof ISSUE_STATUS_LABELS]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
              </div>

              {/* Reporter Info */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Reporter</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                    {issue.reporter.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{issue.reporter.name}</p>
                    <p className="text-sm text-gray-500">{issue.reporter.role}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold">Created</p>
                  <p>{new Date(issue.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Last Updated</p>
                  <p>{new Date(issue.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {(canEdit || canDelete) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                <div className="flex gap-3 flex-wrap">
                  {canEdit && issue.status === 'open' && (
                    <Link
                      href={`/issues/${issue.id}/edit`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Edit Issue
                    </Link>
                  )}
                  {canEdit && issue.status !== 'open' && (
                    <Link
                      href={`/issues/${issue.id}/edit`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Update Status
                    </Link>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete Issue
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Permission Info */}
            {!canEdit && !canDelete && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
                <p className="text-sm">
                  You don&apos;t have permission to edit this issue.
                  {issue.status !== 'open' && ' Only maintainers can edit resolved issues.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Delete Issue?</h3>
            <p className="text-gray-600 mb-2">
              Issue: <strong>{issue?.title}</strong>
            </p>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}