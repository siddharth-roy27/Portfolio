import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

interface CodeforcesStats {
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
}

interface HackerRankStats {
  badges: number;
  certifications: number;
  skillsVerified: number;
  contestRating?: number;
}

interface CodingStats {
  leetcode: LeetCodeStats | null;
  codeforces: CodeforcesStats | null;
  hackerrank: HackerRankStats | null;
  loading: boolean;
  error: string | null;
}

export const useCodingStats = () => {
  const [stats, setStats] = useState<CodingStats>({
    leetcode: null,
    codeforces: null,
    hackerrank: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [leetcodeRes, codeforcesRes, hackerrankRes] = await Promise.all([
          supabase.functions.invoke('coding-stats', {
            body: { platform: 'leetcode', username: 'siddharthroy2708' }
          }),
          supabase.functions.invoke('coding-stats', {
            body: { platform: 'codeforces', username: 'siddharthroy2708' }
          }),
          supabase.functions.invoke('coding-stats', {
            body: { platform: 'hackerrank', username: 'siddharthroy2708' }
          }),
        ]);

        // Log responses for debugging
        console.log('Stats responses:', {
          leetcode: leetcodeRes,
          codeforces: codeforcesRes,
          hackerrank: hackerrankRes,
        });

        // Check for errors in responses
        const hasError = leetcodeRes.error || codeforcesRes.error || hackerrankRes.error;
        
        if (hasError) {
          console.error('Supabase function errors:', {
            leetcode: leetcodeRes.error,
            codeforces: codeforcesRes.error,
            hackerrank: hackerrankRes.error,
          });
        }

        setStats({
          leetcode: leetcodeRes.data?.success ? leetcodeRes.data.stats : (leetcodeRes.error ? null : leetcodeRes.data?.stats || null),
          codeforces: codeforcesRes.data?.success ? codeforcesRes.data.stats : (codeforcesRes.error ? null : codeforcesRes.data?.stats || null),
          hackerrank: hackerrankRes.data?.success ? hackerrankRes.data.stats : (hackerrankRes.error ? null : hackerrankRes.data?.stats || null),
          loading: false,
          error: hasError ? 'Supabase Edge Function not deployed or error occurred. Check console for details.' : null,
        });
      } catch (error) {
        console.error('Error fetching coding stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch stats. Make sure Supabase Edge Function is deployed. See DEPLOY_SUPABASE_FUNCTION.md',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
