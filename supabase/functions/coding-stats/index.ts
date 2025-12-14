import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  contestRating?: number;
}

interface CodeforcesStats {
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
}

interface HackerRankStats {
  badges: number;
  certifications: number;
  skillsVerified: number;
  contestRating?: number;
}

async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  try {
    console.log(`Fetching LeetCode stats for ${username}`);
    
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile {
                ranking
              }
            }
          }
        `,
        variables: { username }
      }),
    });

    const data = await response.json();
    console.log('LeetCode response:', JSON.stringify(data));
    
    if (data.data?.matchedUser) {
      const user = data.data.matchedUser;
      const stats = user.submitStats?.acSubmissionNum || [];
      
      return {
        totalSolved: stats.find((s: any) => s.difficulty === 'All')?.count || 0,
        easySolved: stats.find((s: any) => s.difficulty === 'Easy')?.count || 0,
        mediumSolved: stats.find((s: any) => s.difficulty === 'Medium')?.count || 0,
        hardSolved: stats.find((s: any) => s.difficulty === 'Hard')?.count || 0,
        ranking: user.profile?.ranking || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('LeetCode fetch error:', error);
    return null;
  }
}

async function fetchCodeforcesStats(username: string): Promise<CodeforcesStats | null> {
  try {
    console.log(`Fetching Codeforces stats for ${username}`);
    
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const data = await response.json();
    console.log('Codeforces response:', JSON.stringify(data));
    
    if (data.status === 'OK' && data.result?.[0]) {
      const user = data.result[0];
      return {
        rating: user.rating || 0,
        maxRating: user.maxRating || 0,
        rank: user.rank || 'unrated',
        maxRank: user.maxRank || 'unrated',
        contribution: user.contribution || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Codeforces fetch error:', error);
    return null;
  }
}

async function fetchHackerRankStats(username: string): Promise<HackerRankStats | null> {
  try {
    console.log(`Fetching HackerRank stats for ${username}`);
    
    const profileUrl = `https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`;
    
    try {
      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('HackerRank API response:', JSON.stringify(data));
        
        if (data.model) {
          const model = data.model;
          return {
            badges: model.badges?.length || 0,
            certifications: model.certificates?.length || 0,
            skillsVerified: model.skill_ratings?.length || 0,
            contestRating: model.contest_rating || 0,
          };
        }
      }
    } catch (apiError) {
      console.log('HackerRank API failed, trying alternative method...');
    }
    
    const publicProfileUrl = `https://www.hackerrank.com/${username}`;
    const htmlResponse = await fetch(publicProfileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (htmlResponse.ok) {
      const html = await htmlResponse.text();
      const badgeMatch = html.match(/badges["\s]*:[\s]*(\d+)/i);
      const certMatch = html.match(/certificates["\s]*:[\s]*(\d+)/i);
      
      return {
        badges: badgeMatch ? parseInt(badgeMatch[1]) : 0,
        certifications: certMatch ? parseInt(certMatch[1]) : 0,
        skillsVerified: 0,
      };
    }
    
    return null;
  } catch (error) {
    console.error('HackerRank fetch error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, username } = await req.json();
    console.log(`Request for ${platform} stats, username: ${username}`);

    let stats = null;

    if (platform === 'leetcode') {
      stats = await fetchLeetCodeStats(username);
    } else if (platform === 'codeforces') {
      stats = await fetchCodeforcesStats(username);
    } else if (platform === 'hackerrank') {
      stats = await fetchHackerRankStats(username);
    }

    if (stats) {
      return new Response(JSON.stringify({ success: true, stats }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Could not fetch stats' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in coding-stats function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

