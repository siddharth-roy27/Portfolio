'use client';

import { Button } from '@/components/ui/button';
import { FileText, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export default function EmptyState({ onCreateNote }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Animated icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-pulse" />
          <div className="absolute inset-2 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-2">No note selected</h2>
        <p className="text-muted-foreground mb-6">
          Select a note from the sidebar or create a new one to start writing.
        </p>

        <Button onClick={onCreateNote} className="gap-2 glow-primary">
          <Plus className="w-4 h-4" />
          Create New Note
        </Button>
      </div>
    </div>
  );
}
