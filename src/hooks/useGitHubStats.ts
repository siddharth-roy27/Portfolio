import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GitHubLanguage {
  name: string;
  percentage: number;
  color: string;
}

interface GitHubStats {
  totalContributions: number;
  totalStars: number;
  totalRepositories: number;
  totalCommits: number;
  languages: GitHubLanguage[];
  recentActivity: any[];
  repositories: any[];
  contributionsByMonth: any[];
  pullRequests: number;
  issues: number;
  reviews: number;
}

interface GitHubData {
  stats: GitHubStats | null;
  loading: boolean;
  error: string | null;
}

// Mock data for fallback
const mockGitHubStats: GitHubStats = {
  totalContributions: 1200,
  totalStars: 150,
  totalRepositories: 45,
  totalCommits: 2800,
  languages: [
    { name: 'Python', percentage: 35, color: '#3776ab' },
    { name: 'TypeScript', percentage: 25, color: '#3178c6' },
    { name: 'JavaScript', percentage: 20, color: '#f7df1e' },
    { name: 'C++', percentage: 10, color: '#00599c' },
    { name: 'Go', percentage: 5, color: '#00add8' },
    { name: 'Java', percentage: 3, color: '#007396' },
    { name: 'Shell', percentage: 2, color: '#89e051' },
  ],
  recentActivity: [],
  repositories: [],
  contributionsByMonth: [],
  pullRequests: 180,
  issues: 95,
  reviews: 120,
};

export const useGitHubStats = () => {
  const [data, setData] = useState<GitHubData>({
    stats: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Try to fetch from Supabase Edge Function
        const response = await supabase.functions.invoke('github-stats', {
          body: { username: 'siddharth-roy27' }
        });

        console.log('GitHub stats response:', response);

        if (response.error) {
          console.error('GitHub stats error:', response.error);
          // Use mock data as fallback
          setData({
            stats: mockGitHubStats,
            loading: false,
            error: 'Using cached data. Deploy Supabase Edge Function for live stats.',
          });
        } else if (response.data?.success) {
          setData({
            stats: response.data.stats,
            loading: false,
            error: null,
          });
        } else {
          // Fallback to mock data
          setData({
            stats: mockGitHubStats,
            loading: false,
            error: 'Using cached data. Deploy Supabase Edge Function for live stats.',
          });
        }
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Use mock data as fallback
        setData({
          stats: mockGitHubStats,
          loading: false,
          error: 'Using cached data. Deploy Supabase Edge Function for live stats.',
        });
      }
    };

    fetchGitHubStats();
  }, []);

  return data;
};
