'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/dashboard/Sidebar';
import NoteEditor from '@/components/dashboard/NoteEditor';
import EmptyState from '@/components/dashboard/EmptyState';
import type { Tag } from '@/components/TagManager';

export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  color: string;
  icon: string;
}

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'archive'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (searchParams?.get('success') === 'true') {
      toast({ title: 'Subscription activated!', description: 'Welcome to Pro!' });
    }
  }, [searchParams, toast]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [notesRes, foldersRes, tagsRes] = await Promise.all([
        supabase.from('notes').select('*').order('updated_at', { ascending: false }),
        supabase.from('folders').select('*').order('name'),
        supabase.from('tags').select('*').order('name'),
      ]);

      if (notesRes.error) throw notesRes.error;
      if (foldersRes.error) throw foldersRes.error;
      if (tagsRes.error) throw tagsRes.error;

      // Fetch note tags
      const { data: noteTagsData } = await supabase
        .from('note_tags')
        .select('note_id, tag_id');

      const notesWithTags = (notesRes.data || []).map(note => ({
        ...note,
        tags: (noteTagsData || [])
          .filter(nt => nt.note_id === note.id)
          .map(nt => tagsRes.data?.find(t => t.id === nt.tag_id))
          .filter(Boolean) as Tag[],
      }));

      setNotes(notesWithTags);
      setFolders(foldersRes.data || []);
      setAllTags(tagsRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast({
        title: 'Error',
        description: 'Failed to load your notes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: 'Untitled',
          content: '',
          folder_id: selectedFolder,
        })
        .select()
        .single();

      if (error) throw error;
      
      const noteWithTags = { ...data, tags: [] };
      setNotes([noteWithTags, ...notes]);
      setSelectedNote(noteWithTags);
      
      toast({
        title: 'Note created',
        description: 'Start writing!',
      });
    } catch (err) {
      console.error('Error creating note:', err);
      toast({
        title: 'Error',
        description: 'Failed to create note.',
        variant: 'destructive',
      });
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
      if (selectedNote?.id === id) {
        setSelectedNote({ ...selectedNote, ...updates });
      }
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter(n => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      
      toast({ title: 'Note deleted' });
    } catch (err) {
      console.error('Error deleting note:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete note.',
        variant: 'destructive',
      });
    }
  };

  const createFolder = async (name: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .insert({
          user_id: user.id,
          name,
        })
        .select()
        .single();

      if (error) throw error;
      
      setFolders([...folders, data]);
      toast({ title: 'Folder created' });
    } catch (err) {
      console.error('Error creating folder:', err);
      toast({
        title: 'Error',
        description: 'Failed to create folder.',
        variant: 'destructive',
      });
    }
  };

  const filteredNotes = notes.filter(note => {
    // View mode filter
    if (viewMode === 'favorites' && !note.is_favorite) return false;
    if (viewMode === 'archive' && !note.is_archived) return false;
    if (viewMode === 'all' && note.is_archived) return false;

    // Folder filter
    if (selectedFolder && note.folder_id !== selectedFolder) return false;

    // Tag filter
    if (selectedTagFilter && !note.tags?.some(t => t.id === selectedTagFilter)) return false;

    return true;
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-background flex overflow-hidden">
      <Sidebar
        notes={filteredNotes}
        folders={folders}
        tags={allTags}
        selectedNote={selectedNote}
        selectedFolder={selectedFolder}
        selectedTagFilter={selectedTagFilter}
        viewMode={viewMode}
        onSelectNote={setSelectedNote}
        onSelectFolder={(id) => {
          setSelectedFolder(id);
          setSelectedTagFilter(null);
        }}
        onSelectTagFilter={(id) => {
          setSelectedTagFilter(id);
          setSelectedFolder(null);
        }}
        onSetViewMode={setViewMode}
        onCreateNote={createNote}
        onCreateFolder={createFolder}
        onDeleteNote={deleteNote}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            allTags={allTags}
            userId={user?.id || ''}
            onUpdate={(updates) => updateNote(selectedNote.id, updates)}
            onDelete={() => deleteNote(selectedNote.id)}
            onTagsChange={fetchData}
          />
        ) : (
          <EmptyState onCreateNote={createNote} />
        )}
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
