'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { useIssues } from '@/hooks/useIssues';
import { Issue } from '@/lib/types';
import { ISSUE_TYPE_LABELS, ISSUE_STATUS_LABELS, STATUS_COLORS, TYPE_COLORS } from '@/lib/constants';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function IssuesPage() {
  const { user, logout } = useAuthContext();
  const { issues, isLoading, error, fetchIssues, deleteIssue } = useIssues();
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch issues on mount and when filters change
  useEffect(() => {
    fetchIssues(sort, filterType || undefined, filterStatus || undefined);
  }, [sort, filterType, filterStatus, fetchIssues]);

  const handleDelete = async (id: number) => {
    try {
      await deleteIssue(id);
      toast.success('Issue deleted successfully');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete issue:', error);
      toast.error('Failed to delete issue');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">DevPulse</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.name} ({user?.role})</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Issue Button */}
        <div className="mb-6">
          <Link
            href="/issues/create"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            + Create Issue
          </Link>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4 flex-wrap">
          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="bug">Bug</option>
              <option value="feature_request">Feature Request</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading issues...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Issues List */}
        {!isLoading && issues.length > 0 && (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <Link
                      href={`/issues/${issue.id}`}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      {issue.title}
                    </Link>
                    <p className="text-gray-600 mt-1">{issue.description}</p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${TYPE_COLORS[issue.type as keyof typeof TYPE_COLORS]}`}>
                      {ISSUE_TYPE_LABELS[issue.type as keyof typeof ISSUE_TYPE_LABELS]}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[issue.status as keyof typeof STATUS_COLORS]}`}>
                      {ISSUE_STATUS_LABELS[issue.status as keyof typeof ISSUE_STATUS_LABELS]}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3 mt-3">
                  <p>
                    Reported by <strong>{issue.reporter.name}</strong> ({issue.reporter.role})
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/issues/${issue.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    {(user?.role === 'maintainer' || user?.id === issue.reporter.id) && (
                      <Link
                        href={`/issues/${issue.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    )}
                    {user?.role === 'maintainer' && (
                      <button
                        onClick={() => setDeleteId(issue.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && issues.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">No issues found</p>
            <Link
              href="/issues/create"
              className="text-blue-600 hover:underline"
            >
              Create the first issue
            </Link>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Delete Issue?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}