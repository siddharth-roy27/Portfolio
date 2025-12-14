import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Trophy, Star, Code2, Loader2 } from 'lucide-react';
import { useCodingStats } from '@/hooks/useCodingStats';

interface PlatformCardProps {
  name: string;
  username: string;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
  stats: { label: string; value: string }[];
  badges?: string[];
  rank?: string;
  isInView: boolean;
  index: number;
}

const PlatformCard = ({
  name,
  username,
  href,
  color,
  bgColor,
  borderColor,
  stats,
  badges,
  rank,
  isInView,
  index,
}: PlatformCardProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    className={`glass-card p-6 md:p-8 group cursor-pointer border ${borderColor} hover:border-opacity-60 transition-all`}
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${bgColor}`}>
          <Code2 className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <h3 className={`font-space font-semibold text-lg ${color}`}>
            {name}
          </h3>
          <p className="font-mono text-xs text-muted-foreground">
            @{username}
          </p>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </div>

    {/* Rank Badge */}
    {rank && (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bgColor} border ${borderColor} mb-5`}>
        <Trophy className={`w-3.5 h-3.5 ${color}`} />
        <span className={`font-mono text-sm font-medium ${color}`}>
          {rank}
        </span>
      </div>
    )}

    {/* Stats */}
    <div className="space-y-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{stat.label}</span>
          <span className={`font-mono font-semibold ${color}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>

    {/* Badges */}
    {badges && badges.length > 0 && (
      <div className="pt-4 border-t border-white/5">
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono ${bgColor} ${color}`}
            >
              <Star className="w-3 h-3" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    )}
  </motion.a>
);

const CodingStatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { leetcode, codeforces, hackerrank, loading, error } = useCodingStats();

  // Helper to format rank from ranking number
  const getLeetCodeRank = (ranking: number): string => {
    if (ranking === 0) return 'Unranked';
    const percentile = (ranking / 3000000) * 100;
    if (percentile <= 5) return 'Guardian';
    if (percentile <= 15) return 'Knight';
    if (percentile <= 30) return 'Warrior';
    return 'Coder';
  };

  const platforms = [
    {
      name: 'LeetCode',
      username: 'siddharthroy2708',
      href: 'https://leetcode.com/u/siddharthroy2708/',
      color: 'text-neon-amber',
      bgColor: 'bg-neon-amber/10',
      borderColor: 'border-neon-amber/30',
      stats: loading
        ? [{ label: 'Loading...', value: '...' }]
        : leetcode
        ? [
            { label: 'Problems Solved', value: String(leetcode.totalSolved) },
            { label: 'Easy', value: String(leetcode.easySolved) },
            { label: 'Medium', value: String(leetcode.mediumSolved) },
            { label: 'Hard', value: String(leetcode.hardSolved) },
            ...(leetcode.ranking > 0 ? [{ label: 'Global Ranking', value: `#${leetcode.ranking.toLocaleString()}` }] : []),
          ]
        : [
            { label: 'Loading stats...', value: '...' },
          ],
      badges: ['100 Days', '50 Days', 'SQL'],
      rank: loading ? '...' : leetcode ? getLeetCodeRank(leetcode.ranking) : 'Knight',
    },
    {
      name: 'Codeforces',
      username: 'siddharthroy2708',
      href: 'https://codeforces.com/profile/siddharthroy2708',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      stats: loading
        ? [{ label: 'Loading...', value: '...' }]
        : codeforces
        ? [
            { label: 'Current Rating', value: String(codeforces.rating) },
            { label: 'Max Rating', value: String(codeforces.maxRating) },
            { label: 'Current Rank', value: codeforces.rank },
            { label: 'Max Rank', value: codeforces.maxRank },
          ]
        : [
            { label: 'Loading stats...', value: '...' },
          ],
      rank: loading ? '...' : codeforces?.rank || 'Pupil',
    },
    {
      name: 'HackerRank',
      username: 'siddharthroy2708',
      href: 'https://www.hackerrank.com/profile/siddharthroy2708',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
      stats: loading
        ? [{ label: 'Loading...', value: '...' }]
        : hackerrank
        ? [
            { label: 'Badges', value: String(hackerrank.badges) },
            { label: 'Certifications', value: String(hackerrank.certifications) },
            { label: 'Skills Verified', value: String(hackerrank.skillsVerified) },
            ...(hackerrank.contestRating && hackerrank.contestRating > 0 
              ? [{ label: 'Contest Rating', value: String(hackerrank.contestRating) }] 
              : []),
          ]
        : [
            { label: 'Loading stats...', value: '...' },
          ],
      badges: ['Problem Solving', 'Python', 'C++'],
    },
  ];

  return (
    <section id="coding-stats" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            Competitive <span className="gradient-text">Programming</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Building problem-solving skills through algorithmic challenges
          </p>
          {loading && (
            <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Fetching live stats...</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center">
                ⚠️ {error}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Make sure to deploy the Supabase Edge Function. See DEPLOY_SUPABASE_FUNCTION.md
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {platforms.map((platform, index) => (
            <PlatformCard
              key={platform.name}
              {...platform}
              isInView={isInView}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodingStatsSection;
