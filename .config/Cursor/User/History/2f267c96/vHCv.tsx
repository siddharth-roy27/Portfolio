'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, X, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagManagerProps {
  noteId: string;
  tags: Tag[];
  allTags: Tag[];
  onTagsChange: () => void;
  userId: string;
}

const TAG_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#06b6d4',
];

export function TagManager({ noteId, tags, allTags, onTagsChange, userId }: TagManagerProps) {
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .insert({ name: newTagName.trim(), color: selectedColor, user_id: userId })
        .select()
        .single();

      if (tagError) throw tagError;

      await supabase
        .from('note_tags')
        .insert({ note_id: noteId, tag_id: tagData.id });

      setNewTagName('');
      onTagsChange();
      toast({ title: 'Tag created' });
    } catch (err) {
      console.error('Error creating tag:', err);
      toast({ title: 'Error', description: 'Failed to create tag', variant: 'destructive' });
    }
  };

  const handleAddExistingTag = async (tagId: string) => {
    try {
      await supabase
        .from('note_tags')
        .insert({ note_id: noteId, tag_id: tagId });

      onTagsChange();
    } catch (err) {
      console.error('Error adding tag:', err);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await supabase
        .from('note_tags')
        .delete()
        .eq('note_id', noteId)
        .eq('tag_id', tagId);

      onTagsChange();
    } catch (err) {
      console.error('Error removing tag:', err);
    }
  };

  const availableTags = allTags.filter(t => !tags.some(nt => nt.id === t.id));

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="outline"
          className="gap-1 pr-1"
          style={{ borderColor: tag.color, color: tag.color }}
        >
          {tag.name}
          <button
            onClick={() => handleRemoveTag(tag.id)}
            className="hover:bg-destructive/20 rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <Tag className="w-3 h-3 mr-1" />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="glass-strong w-64 p-3" align="start">
          <div className="space-y-3">
            {availableTags.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Existing tags</p>
                <div className="flex flex-wrap gap-1">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer hover:opacity-80"
                      style={{ borderColor: tag.color, color: tag.color }}
                      onClick={() => handleAddExistingTag(tag.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground mb-2">Create new tag</p>
              <div className="flex gap-2 mb-2">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-5 h-5 rounded-full transition-transform ${
                      selectedColor === color ? 'scale-125 ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                  className="h-8 text-sm"
                />
                <Button size="sm" onClick={handleCreateTag} className="h-8">
                  Add
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

