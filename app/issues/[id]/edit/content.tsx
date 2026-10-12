'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import { useIssues } from '@/hooks/useIssues';
import { Issue } from '@/lib/types';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditIssueContent() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const { user } = useAuthContext();
  const { fetchSingleIssue, updateIssue, isLoading } = useIssues();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'bug' | 'feature_request'>('bug');
  const [status, setStatus] = useState<'open' | 'in_progress' | 'resolved'>('open');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch issue on mount
  useEffect(() => {
    const loadIssue = async () => {
      try {
        const data = await fetchSingleIssue(id);
        if (data) {
          setIssue(data);
          setTitle(data.title);
          setDescription(data.description);
          setType(data.type);
          setStatus(data.status);
        } else {
          setError('Issue not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load issue');
      }
    };

    loadIssue();
  }, [id, fetchSingleIssue]);

  // Check permissions
  const canEdit = user?.role === 'maintainer' || (user?.id === issue?.reporter.id && issue?.status === 'open');
  const canEditStatus = user?.role === 'maintainer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (title.length > 150) {
      toast.error('Title must be 150 characters or less');
      return;
    }

    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    try {
      setIsSaving(true);
      await updateIssue(id, {
        title: title.trim(),
        description: description.trim(),
        type,
        status,
      });
      toast.success('Issue updated successfully!');
      router.push(`/issues/${id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update issue';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Link href={`/issues/${id}`} className="text-blue-600 hover:underline">
            ← Back to Issue
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Issue</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
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

        {/* Permission Error */}
        {!isLoading && issue && !canEdit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>You don&apos;t have permission to edit this issue.</p>
            {issue.status !== 'open' && (
              <p className="mt-2">Only maintainers can edit resolved issues.</p>
            )}
          </div>
        )}

        {/* Edit Form */}
        {!isLoading && issue && canEdit && (
          <div className="bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Issue title"
                  maxLength={150}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/150 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length} characters (minimum 20)
                </p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'bug' | 'feature_request')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  <option value="bug">🐛 Bug Report</option>
                  <option value="feature_request">✨ Feature Request</option>
                </select>
              </div>

              {/* Status - Only maintainers can change */}
              {canEditStatus && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'open' | 'in_progress' | 'resolved')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSaving}
                  >
                    <option value="open">🟢 Open</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="resolved">✅ Resolved</option>
                  </select>
                </div>
              )}

              {/* Status Display - Contributors can't change */}
              {!canEditStatus && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {status}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Only maintainers can change the status.
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href={`/issues/${id}`}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}