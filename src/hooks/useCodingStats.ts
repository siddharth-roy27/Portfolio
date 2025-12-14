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

interface CodingStats {
  leetcode: LeetCodeStats | null;
  codeforces: CodeforcesStats | null;
  loading: boolean;
  error: string | null;
}

export const useCodingStats = () => {
  const [stats, setStats] = useState<CodingStats>({
    leetcode: null,
    codeforces: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch LeetCode stats
        const leetcodeRes = await supabase.functions.invoke('coding-stats', {
          body: { platform: 'leetcode', username: 'siddharthroy2708' }
        });

        // Fetch Codeforces stats
        const codeforcesRes = await supabase.functions.invoke('coding-stats', {
          body: { platform: 'codeforces', username: 'siddharthroy2708' }
        });

        setStats({
          leetcode: leetcodeRes.data?.stats || null,
          codeforces: codeforcesRes.data?.stats || null,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching coding stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch stats',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
