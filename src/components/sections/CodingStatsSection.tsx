import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Trophy, Target, Flame, Star, Award, Code2 } from 'lucide-react';

interface PlatformStats {
  name: string;
  username: string;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
  stats: { label: string; value: string }[];
  badges?: string[];
  rank?: string;
}

const platforms: PlatformStats[] = [
  {
    name: 'LeetCode',
    username: 'siddharthroy2708',
    href: 'https://leetcode.com/u/siddharthroy2708/',
    color: 'text-neon-amber',
    bgColor: 'bg-neon-amber/10',
    borderColor: 'border-neon-amber/30',
    stats: [
      { label: 'Problems Solved', value: '300+' },
      { label: 'Contest Rating', value: '1650+' },
      { label: 'Global Rank', value: 'Top 15%' },
    ],
    badges: ['100 Days', '50 Days', 'SQL'],
    rank: 'Knight',
  },
  {
    name: 'Codeforces',
    username: 'siddharthroy2708',
    href: 'https://codeforces.com/profile/siddharthroy2708',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    stats: [
      { label: 'Max Rating', value: '1200+' },
      { label: 'Problems Solved', value: '150+' },
      { label: 'Contests', value: '25+' },
    ],
    rank: 'Pupil',
  },
  {
    name: 'HackerRank',
    username: 'siddharthroy2708',
    href: 'https://www.hackerrank.com/profile/siddharthroy2708',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30',
    stats: [
      { label: 'Badges', value: '5⭐' },
      { label: 'Certifications', value: '3+' },
      { label: 'Skills Verified', value: '5+' },
    ],
    badges: ['Problem Solving', 'Python', 'C++'],
  },
];

const CodingStatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {platforms.map((platform, index) => (
            <motion.a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`glass-card p-6 md:p-8 group cursor-pointer border ${platform.borderColor} hover:border-opacity-60 transition-all`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${platform.bgColor}`}>
                    <Code2 className={`w-5 h-5 ${platform.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-space font-semibold text-lg ${platform.color}`}>
                      {platform.name}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      @{platform.username}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>

              {/* Rank Badge */}
              {platform.rank && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${platform.bgColor} border ${platform.borderColor} mb-5`}>
                  <Trophy className={`w-3.5 h-3.5 ${platform.color}`} />
                  <span className={`font-mono text-sm font-medium ${platform.color}`}>
                    {platform.rank}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-4 mb-6">
                {platform.stats.map((stat, statIndex) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className={`font-mono font-semibold ${platform.color}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Badges */}
              {platform.badges && (
                <div className="pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {platform.badges.map((badge) => (
                      <span
                        key={badge}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono ${platform.bgColor} ${platform.color}`}
                      >
                        <Star className="w-3 h-3" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.a>
          ))}
        </div>

        {/* Activity Graph Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 glass-card p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-neon-rose/10">
              <Flame className="w-5 h-5 text-neon-rose" />
            </div>
            <h3 className="font-space font-semibold text-lg">Consistency & Progress</h3>
          </div>
          
          {/* Activity Heatmap Style */}
          <div className="grid grid-cols-12 md:grid-cols-24 gap-1.5">
            {Array.from({ length: 72 }).map((_, i) => {
              const intensity = Math.random();
              let bgClass = 'bg-muted/30';
              if (intensity > 0.8) bgClass = 'bg-primary';
              else if (intensity > 0.6) bgClass = 'bg-primary/70';
              else if (intensity > 0.4) bgClass = 'bg-primary/40';
              else if (intensity > 0.2) bgClass = 'bg-primary/20';
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.2, delay: 0.6 + i * 0.01 }}
                  className={`aspect-square rounded-sm ${bgClass}`}
                />
              );
            })}
          </div>
          
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted/30" />
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/70" />
              <div className="w-3 h-3 rounded-sm bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CodingStatsSection;
