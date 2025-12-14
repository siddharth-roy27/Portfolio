'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sparkles,
  Plus,
  FileText,
  Folder,
  Star,
  Archive,
  Settings,
  LogOut,
  MoreHorizontal,
  Trash2,
  ChevronRight,
  User,
  Tag,
  Crown,
} from 'lucide-react';
import type { Note, Folder as FolderType } from '@/pages/Dashboard';
import type { Tag as TagType } from '@/components/TagManager';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  notes: Note[];
  folders: FolderType[];
  tags: TagType[];
  selectedNote: Note | null;
  selectedFolder: string | null;
  selectedTagFilter: string | null;
  viewMode: 'all' | 'favorites' | 'archive';
  onSelectNote: (note: Note) => void;
  onSelectFolder: (folderId: string | null) => void;
  onSelectTagFilter: (tagId: string | null) => void;
  onSetViewMode: (mode: 'all' | 'favorites' | 'archive') => void;
  onCreateNote: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteNote: (id: string) => void;
}

export default function Sidebar({
  notes,
  folders,
  tags,
  selectedNote,
  selectedFolder,
  selectedTagFilter,
  viewMode,
  onSelectNote,
  onSelectFolder,
  onSelectTagFilter,
  onSetViewMode,
  onCreateNote,
  onCreateFolder,
  onDeleteNote,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [newFolderName, setNewFolderName] = useState('');
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setFolderDialogOpen(false);
    }
  };

  return (
    <aside className="w-72 border-r border-border/50 bg-sidebar/80 backdrop-blur-xl flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold">NoteForge AI</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3 h-3" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-strong">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings?tab=billing')}>
                <Crown className="w-4 h-4 mr-2 text-accent" />
                Upgrade to Pro
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button onClick={onCreateNote} className="w-full gap-2 glow-primary">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {/* All Notes */}
          <button
            onClick={() => {
              onSelectFolder(null);
              onSelectTagFilter(null);
              onSetViewMode('all');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'all' && !selectedFolder && !selectedTagFilter
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            All Notes
            <span className="ml-auto text-xs text-muted-foreground">{notes.length}</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => {
              onSelectFolder(null);
              onSelectTagFilter(null);
              onSetViewMode('favorites');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'favorites'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Star className="w-4 h-4" />
            Favorites
          </button>

          {/* Archive */}
          <button
            onClick={() => {
              onSelectFolder(null);
              onSelectTagFilter(null);
              onSetViewMode('archive');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'archive'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <Archive className="w-4 h-4" />
            Archive
          </button>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1 px-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className={`cursor-pointer transition-all text-xs ${
                    selectedTagFilter === tag.id ? 'ring-2 ring-primary' : 'hover:opacity-80'
                  }`}
                  style={{ borderColor: tag.color, color: tag.color }}
                  onClick={() => onSelectTagFilter(selectedTagFilter === tag.id ? null : tag.id)}
                >
                  <Tag className="w-2 h-2 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Folders */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Folders</span>
            <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-strong">
                <DialogHeader>
                  <DialogTitle>Create Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    className="glass"
                  />
                  <Button onClick={handleCreateFolder} className="w-full">Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => {
                  onSelectFolder(folder.id);
                  onSetViewMode('all');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Folder className="w-4 h-4" style={{ color: folder.color }} />
                <span className="truncate">{folder.name}</span>
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Notes List */}
        <div className="mt-6">
          <div className="px-3 mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</span>
          </div>
          
          <div className="space-y-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  selectedNote?.id === note.id
                    ? 'bg-primary/20 text-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
                onClick={() => onSelectNote(note)}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="truncate block">{note.title || 'Untitled'}</span>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1 mt-0.5">
                      {note.tags.slice(0, 2).map(tag => (
                        <div
                          key={tag.id}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">+{note.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-strong">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
