import { useState, useEffect } from 'react';

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

// Language color mapping for GitHub languages
const languageColors: { [key: string]: string } = {
  'JavaScript': '#f7df1e',
  'TypeScript': '#3178c6',
  'Python': '#3776ab',
  'C': '#a8b9cc',
  'C++': '#00599c',
  'Go': '#00add8',
  'Java': '#007396',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#1572b6',
  'Rust': '#000000',
  'PHP': '#777bb4',
  'Ruby': '#cc342d',
  'Swift': '#fa7343',
  'Kotlin': '#7f52ff',
  'Dart': '#00b4ab',
  'R': '#198ce7',
  'MATLAB': '#e16737',
  'Vim Script': '#199f4b',
  'Dockerfile': '#2496ed',
  'Makefile': '#427819',
  'Jupyter Notebook': '#da5b0b',
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
        const username = 'siddharth-roy27';

        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            // Add token if available in environment
            ...((import.meta as any).env?.VITE_GITHUB_TOKEN && {
              'Authorization': `token ${(import.meta as any).env.VITE_GITHUB_TOKEN}`
            })
          }
        });

        if (!userResponse.ok) {
          throw new Error(`GitHub API error: ${userResponse.status}`);
        }

        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              ...((import.meta as any).env?.VITE_GITHUB_TOKEN && {
                'Authorization': `token ${(import.meta as any).env.VITE_GITHUB_TOKEN}`
              })
            }
          }
        );

        if (!reposResponse.ok) {
          throw new Error(`GitHub API error: ${reposResponse.status}`);
        }

        const reposData = await reposResponse.json();

        // Calculate stats from real data
        const totalStars = reposData.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);
        const totalRepositories = reposData.length;

        // Calculate language usage
        const languageStats: { [key: string]: number } = {};
        let totalBytes = 0;

        // Get language stats for each repo (simplified approach)
        const languagePromises = reposData.slice(0, 10).map(async (repo: any) => {
          try {
            const langResponse = await fetch(repo.languages_url, {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                ...((import.meta as any).env?.VITE_GITHUB_TOKEN && {
                  'Authorization': `token ${(import.meta as any).env.VITE_GITHUB_TOKEN}`
                })
              }
            });
            if (langResponse.ok) {
              const langData = await langResponse.json();
              return langData;
            }
          } catch (error) {
            console.warn(`Failed to fetch languages for ${repo.name}:`, error);
          }
          return {};
        });

        const languageResults = await Promise.all(languagePromises);

        languageResults.forEach(langData => {
          Object.entries(langData).forEach(([lang, bytes]: [string, any]) => {
            languageStats[lang] = (languageStats[lang] || 0) + bytes;
            totalBytes += bytes;
          });
        });

        // Convert to percentages and sort
        const languages: GitHubLanguage[] = Object.entries(languageStats)
          .map(([name, bytes]) => ({
            name,
            percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
            color: languageColors[name] || '#6b7280'
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 7); // Top 7 languages

        // Mock additional stats that would need more complex API calls
        // These could be replaced with real API calls to contribution graphs, PRs, etc.
        const stats: GitHubStats = {
          totalContributions: Math.floor(Math.random() * 500) + 800, // Placeholder
          totalStars,
          totalRepositories,
          totalCommits: Math.floor(Math.random() * 1000) + 2000, // Placeholder
          languages,
          recentActivity: [],
          repositories: reposData.slice(0, 6), // Top 6 repos
          contributionsByMonth: [],
          pullRequests: Math.floor(Math.random() * 50) + 100, // Placeholder
          issues: Math.floor(Math.random() * 30) + 50, // Placeholder
          reviews: Math.floor(Math.random() * 40) + 80, // Placeholder
        };

        setData({
          stats,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        setData({
          stats: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch GitHub data',
        });
      }
    };

    fetchGitHubStats();
  }, []);

  return data;
};
