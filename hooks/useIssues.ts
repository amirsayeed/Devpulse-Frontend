'use client';

import { useState, useCallback } from 'react';
import { issuesAPI } from '@/lib/api';
import { Issue } from '@/lib/types';

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async (sort = 'newest', type?: string, status?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await issuesAPI.getAll(sort, type, status);
      setIssues(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSingleIssue = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await issuesAPI.getSingle(id);
      return response.data.data as Issue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issue');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createIssue = useCallback(async (data: { title: string; description: string; type: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await issuesAPI.create(data);
      setIssues([response.data.data, ...issues]);
      return response.data.data as Issue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create issue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [issues]);

  const updateIssue = useCallback(async (id: number, data: Partial<Issue>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await issuesAPI.update(id, data);
      setIssues(issues.map(issue => (issue.id === id ? response.data.data : issue)));
      return response.data.data as Issue;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update issue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [issues]);

  const deleteIssue = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await issuesAPI.delete(id);
      setIssues(issues.filter(issue => issue.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete issue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [issues]);

  return {
    issues,
    isLoading,
    error,
    fetchIssues,
    fetchSingleIssue,
    createIssue,
    updateIssue,
    deleteIssue,
  };
};