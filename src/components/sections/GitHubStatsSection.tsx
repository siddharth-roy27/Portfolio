import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Github,
  Star,
  GitFork,
  GitPullRequest,
  MessageSquare,
  TrendingUp,
  Calendar,
  Code2,
  Eye,
  Users,
  Loader2
} from 'lucide-react';
import { useGitHubStats } from '@/hooks/useGitHubStats';

const StatCard = ({
  icon,
  label,
  value,
  color,
  isInView,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  isInView: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
    transition={{
      duration: 0.5,
      delay,
      type: "spring",
      stiffness: 200
    }}
    className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
  >
    <div className="flex justify-center mb-4">
      <div
        className="p-3 rounded-full"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </div>
    </div>
    <div className="font-mono text-2xl font-bold mb-2" style={{ color }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
);

const LanguageChart = ({
  languages,
  isInView,
  delay
}: {
  languages: any[];
  isInView: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={isInView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.6, delay }}
    className="glass-card p-6"
  >
    <h3 className="font-space font-semibold text-lg mb-6 flex items-center gap-2">
      <Code2 className="w-5 h-5" />
      Language Usage
    </h3>

    <div className="space-y-4">
      {languages.map((lang, index) => (
        <motion.div
          key={lang.name}
          initial={{ opacity: 0, width: 0 }}
          animate={isInView ? { opacity: 1, width: "100%" } : {}}
          transition={{ duration: 0.8, delay: delay + index * 0.1 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-sm">{lang.name}</span>
            <span className="text-sm text-muted-foreground">{lang.percentage.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${lang.percentage}%` } : {}}
              transition={{
                duration: 1.2,
                delay: delay + index * 0.1 + 0.2,
                ease: "easeOut"
              }}
              className="h-full rounded-full"
              style={{ backgroundColor: lang.color }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const RadarChart = ({
  stats,
  isInView,
  delay
}: {
  stats: any;
  isInView: boolean;
  delay: number;
}) => {
  const radarData = [
    { label: 'Commits', value: Math.min(stats?.totalCommits / 50 || 0, 100), color: '#8b5cf6' },
    { label: 'Repos', value: Math.min(stats?.totalRepositories / 5 || 0, 100), color: '#06b6d4' },
    { label: 'PRs', value: Math.min(stats?.pullRequests / 10 || 0, 100), color: '#10b981' },
    { label: 'Issues', value: Math.min(stats?.issues / 5 || 0, 100), color: '#f59e0b' },
    { label: 'Reviews', value: Math.min(stats?.reviews / 5 || 0, 100), color: '#ef4444' },
    { label: 'Stars', value: Math.min(stats?.totalStars / 10 || 0, 100), color: '#eab308' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay }}
      className="glass-card p-6"
    >
      <h3 className="font-space font-semibold text-lg mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Activity Radar
      </h3>

      <div className="relative w-full h-64 flex items-center justify-center">
        {/* Radar grid */}
        {[20, 40, 60, 80, 100].map((level) => (
          <motion.div
            key={level}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: level / 100, opacity: 0.3 } : {}}
            transition={{ duration: 0.8, delay: delay + level * 0.02 }}
            className="absolute border border-white/20 rounded-full"
            style={{
              width: `${level * 2}%`,
              height: `${level * 2}%`,
            }}
          />
        ))}

        {/* Radar shape */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
        >
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.8 } : {}}
            transition={{ duration: 1, delay: delay + 0.5 }}
            points={
              radarData.map((point, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const radius = (point.value / 100) * 80;
                const x = 100 + radius * Math.cos(angle);
                const y = 100 + radius * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ')
            }
            fill="rgba(139, 92, 246, 0.2)"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
        </svg>

        {/* Labels */}
        {radarData.map((point, index) => {
          const angle = index * 60 - 90;
          const labelRadius = 95;
          const x = 100 + labelRadius * Math.cos(angle * Math.PI / 180);
          const y = 100 + labelRadius * Math.sin(angle * Math.PI / 180);

          return (
            <motion.div
              key={point.label}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: delay + index * 0.1 }}
              className="absolute text-xs text-muted-foreground font-mono"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {point.label}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const GitHubStatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { stats: githubStats, loading, error } = useGitHubStats();

  const stats = githubStats || {
    totalContributions: 1200,
    totalStars: 150,
    totalRepositories: 45,
    totalCommits: 2800,
    languages: [
      { name: 'Python', percentage: 35, color: '#3776ab' },
      { name: 'TypeScript', percentage: 25, color: '#3178c6' },
      { name: 'JavaScript', percentage: 20, color: '#f7df1e' },
    ],
    pullRequests: 180,
    issues: 95,
    reviews: 120,
  };

  return (
    <section id="github-stats" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            GitHub <span className="gradient-text">Analytics</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Comprehensive insights into my coding activity and contributions
          </p>
          {loading && (
            <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Fetching live GitHub stats...</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center">
                ⚠️ {error}
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Contributions"
            value={stats.totalContributions}
            color="#8b5cf6"
            isInView={isInView}
            delay={0.1}
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="Stars Earned"
            value={stats.totalStars}
            color="#eab308"
            isInView={isInView}
            delay={0.2}
          />
          <StatCard
            icon={<Github className="w-5 h-5" />}
            label="Repositories"
            value={stats.totalRepositories}
            color="#06b6d4"
            isInView={isInView}
            delay={0.3}
          />
          <StatCard
            icon={<GitPullRequest className="w-5 h-5" />}
            label="Pull Requests"
            value={stats.pullRequests}
            color="#10b981"
            isInView={isInView}
            delay={0.4}
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Language Usage Chart */}
          <LanguageChart
            languages={stats.languages}
            isInView={isInView}
            delay={0.6}
          />

          {/* Activity Radar */}
          <RadarChart
            stats={stats}
            isInView={isInView}
            delay={0.8}
          />
        </div>

        {/* Additional Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-3 gap-4 md:gap-6 mt-12"
        >
          <div className="glass-card p-4 text-center">
            <div className="flex justify-center mb-2">
              <MessageSquare className="w-4 h-4 text-orange-500" />
            </div>
            <div className="font-mono text-lg font-bold text-orange-500">{stats.issues}</div>
            <div className="text-xs text-muted-foreground">Issues</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="flex justify-center mb-2">
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <div className="font-mono text-lg font-bold text-blue-500">{stats.reviews}</div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="flex justify-center mb-2">
              <Calendar className="w-4 h-4 text-green-500" />
            </div>
            <div className="font-mono text-lg font-bold text-green-500">{stats.totalCommits}</div>
            <div className="text-xs text-muted-foreground">Commits</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubStatsSection;
