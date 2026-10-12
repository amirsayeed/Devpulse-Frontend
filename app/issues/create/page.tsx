'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import { useIssues } from '@/hooks/useIssues';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateIssuePage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { createIssue, isLoading } = useIssues();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'bug' | 'feature_request'>('bug');

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
      await createIssue({
        title: title.trim(),
        description: description.trim(),
        type,
      });
      toast.success('Issue created successfully!');
      router.push('/issues');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create issue';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/issues" className="text-blue-600 hover:underline">
            ← Back to Issues
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Create New Issue</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-6 py-8">
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
                placeholder="Brief title of the issue"
                maxLength={150}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
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
                placeholder="Detailed explanation of the issue..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={isLoading}
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
                disabled={isLoading}
              >
                <option value="bug">🐛 Bug Report</option>
                <option value="feature_request">✨ Feature Request</option>
              </select>
            </div>

            {/* Reporter Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Reporter:</strong> {user?.name} ({user?.role})
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {isLoading ? 'Creating...' : 'Create Issue'}
              </button>
              <Link
                href="/issues"
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}