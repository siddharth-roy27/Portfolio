'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, Zap, Shield, ArrowRight, Brain, Upload, Tag, CreditCard, Play } from 'lucide-react';
import { AnimatedBackground, type BackgroundTheme } from '@/components/AnimatedBackground';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function Landing() {
  const [theme, setTheme] = useState<BackgroundTheme>('cyber');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground theme={theme} />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <Sparkles className="w-5 h-5 text-background" />
          </div>
          <span className="text-xl font-semibold">NoteForge AI</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
          <Link href="/auth">
            <Button variant="ghost" className="glass glass-hover">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">Powered by Gemini AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your Ideas,{' '}
            <span className="text-gradient animate-gradient bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]">
              Supercharged
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A beautiful, AI-powered note-taking experience. Write, organize, and enhance your notes with the power of artificial intelligence.
          </p>

          {/* Live typing effect */}
          <div className="glass rounded-xl p-4 max-w-lg mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">AI Assistant</p>
                <p className="text-foreground">
                  I've summarized your meeting notes into 5 key action items
                  <span className="inline-block w-0.5 h-4 bg-accent ml-1 animate-typing" />
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/auth">
              <Button size="lg" className="glow-primary text-lg px-8 py-6 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="glass glass-hover text-lg px-8 py-6 gap-2"
              onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-32">
          <FeatureCard
            icon={<FileText className="w-6 h-6" />}
            title="Rich Text Editor"
            description="Beautiful TipTap editor with tables, images, links, and full formatting support."
            delay="0.4s"
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="AI Assistant"
            description="Summarize, improve, and extract content with built-in Gemini AI."
            delay="0.5s"
            highlight
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Lightning Fast"
            description="Instant sync, auto-save, and real-time collaboration features."
            delay="0.6s"
          />
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <FeatureCard
            icon={<Tag className="w-6 h-6" />}
            title="Color-coded Tags"
            description="Organize notes with customizable color-coded tags for easy filtering."
            delay="0.7s"
          />
          <FeatureCard
            icon={<Upload className="w-6 h-6" />}
            title="File Support"
            description="Upload PDFs, images, code files, and PowerPoints. Extract text automatically."
            delay="0.8s"
          />
          <FeatureCard
            icon={<CreditCard className="w-6 h-6" />}
            title="Pro Features"
            description="Unlock unlimited AI, text extraction, and priority support with Stripe billing."
            delay="0.9s"
          />
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 mt-20 text-muted-foreground animate-fade-in" style={{ animationDelay: '1s' }}>
          <Shield className="w-4 h-4" />
          <span className="text-sm">Secure & Private • End-to-end encrypted</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-sm text-muted-foreground border-t border-border/30">
        <p>© 2024 NoteForge AI. Built for productivity.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay,
  highlight 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: string;
  highlight?: boolean;
}) {
  return (
    <div 
      className={`glass glass-hover p-8 rounded-2xl animate-fade-in group transition-all duration-300 ${highlight ? 'glow-accent border-accent/30' : 'hover:border-primary/30'}`}
      style={{ animationDelay: delay }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${highlight ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
