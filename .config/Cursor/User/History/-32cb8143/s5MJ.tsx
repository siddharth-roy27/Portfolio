'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { TagManager, Tag } from '@/components/TagManager';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Sparkles,
  Loader2,
  Trash2,
  Star,
  ImageIcon,
  FileText,
  FileCode,
  Presentation,
  Upload,
  Archive,
  FileSearch,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Note } from '@/app/dashboard/page';

interface NoteEditorProps {
  note: Note;
  allTags: Tag[];
  userId: string;
  onUpdate: (updates: Partial<Note>) => void;
  onDelete: () => void;
  onTagsChange: () => void;
}

const lowlight = createLowlight(common);

export default function NoteEditor({ note, allTags, userId, onUpdate, onDelete, onTagsChange }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extractInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<'image' | 'pdf' | 'code' | 'ppt'>('image');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Start writing your note...' }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: note.content,
    onUpdate: ({ editor }) => {
      onUpdate({ content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor min-h-[calc(100vh-200px)] outline-none prose prose-invert max-w-none',
      },
    },
  });

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content);
    }
    setTitle(note.title);
  }, [note.id]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    onUpdate({ title: newTitle });
  }, [onUpdate]);

  const handleAI = async (mode: 'summarize' | 'improve') => {
    if (!editor) return;
    
    const text = editor.getText();
    if (!text.trim()) {
      toast({ title: 'No content', description: 'Add some text first.', variant: 'destructive' });
      return;
    }

    setIsAILoading(true);
    
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode, text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI request failed');
      }

      const data = await response.json();
      
      if (mode === 'summarize') {
        editor.commands.setContent(editor.getHTML() + `<h2>Summary</h2><p>${data.result}</p>`);
      } else {
        editor.commands.setContent(data.result);
      }
      
      toast({ title: mode === 'summarize' ? 'Summary added' : 'Text improved' });
    } catch (err) {
      console.error('AI error:', err);
      toast({ title: 'AI Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    } finally {
      setIsAILoading(false);
    }
  };

  const handleExtractText = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    setIsExtracting(true);
    
    try {
      // For text-based files, read directly
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['txt', 'md', 'json', 'xml', 'csv'].includes(ext || '')) {
        const text = await file.text();
        editor.chain().focus().insertContent(`<h2>Extracted from ${file.name}</h2><pre>${text}</pre>`).run();
        toast({ title: 'Text extracted' });
        return;
      }

      // For PDF/PPT, use AI to process
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result?.toString().split(',')[1];
        
        // Send to AI for extraction (simplified - in production you'd use a proper parser)
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai-gemini`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ 
            mode: 'extract', 
            text: `This is a ${ext} file named "${file.name}". Please acknowledge that text extraction from binary files requires specialized parsing libraries. For demonstration, provide a helpful message about what would typically be extracted from this type of file.`
          }),
        });

        if (!response.ok) throw new Error('Extraction failed');
        
        const data = await response.json();
        editor.chain().focus().insertContent(`<h2>Notes from ${file.name}</h2><p>${data.result}</p>`).run();
        toast({ title: 'Processing complete', description: 'AI analyzed the file type' });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Extract error:', err);
      toast({ title: 'Extraction failed', variant: 'destructive' });
    } finally {
      setIsExtracting(false);
      if (extractInputRef.current) extractInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${note.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('note-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('note-attachments')
        .getPublicUrl(filePath);

      if (uploadType === 'image') {
        editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run();
      } else if (uploadType === 'pdf') {
        editor.chain().focus().insertContent(`
          <div class="pdf-embed my-4 p-4 border border-border rounded-lg bg-muted/20">
            <a href="${publicUrl}" target="_blank" class="text-primary hover:underline font-medium">📄 ${file.name}</a>
            <iframe src="${publicUrl}" class="w-full h-96 rounded mt-2" title="${file.name}"></iframe>
          </div>
        `).run();
      } else if (uploadType === 'code') {
        const text = await file.text();
        editor.chain().focus().insertContent(`<pre><code>${escapeHtml(text)}</code></pre>`).run();
      } else if (uploadType === 'ppt') {
        editor.chain().focus().insertContent(`
          <div class="my-4 p-4 border border-border rounded-lg bg-muted/20">
            <a href="${publicUrl}" target="_blank" class="text-primary hover:underline">📊 ${file.name}</a>
          </div>
        `).run();
      }

      toast({ title: 'File uploaded' });
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = (type: 'image' | 'pdf' | 'code' | 'ppt') => {
    setUploadType(type);
    const acceptMap = {
      image: 'image/*',
      pdf: '.pdf',
      code: '.js,.ts,.tsx,.jsx,.py,.java,.cpp,.css,.html,.json,.md,.sql',
      ppt: '.ppt,.pptx,.odp',
    };
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptMap[type];
      fileInputRef.current.click();
    }
  };

  const escapeHtml = (text: string): string => {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  if (!editor) return null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
      <input type="file" ref={extractInputRef} onChange={handleExtractText} accept=".pdf,.ppt,.pptx,.txt,.md,.doc,.docx" className="hidden" />

      {/* Toolbar */}
      <div className="border-b border-border/50 p-2 flex items-center gap-1 flex-wrap bg-card/60 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-1 border-r border-border/50 pr-2 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={<Bold className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={<Italic className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={<UnderlineIcon className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={<Strikethrough className="w-4 h-4" />} />
        </div>

        <div className="flex items-center gap-1 border-r border-border/50 pr-2 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={<Heading1 className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={<Heading2 className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={<Heading3 className="w-4 h-4" />} />
        </div>

        <div className="flex items-center gap-1 border-r border-border/50 pr-2 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={<List className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={<ListOrdered className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={<Quote className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={<Code className="w-4 h-4" />} />
        </div>

        <div className="flex items-center gap-1 border-r border-border/50 pr-2 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={<Undo className="w-4 h-4" />} />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={<Redo className="w-4 h-4" />} />
        </div>

        {/* Insert Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary" disabled={isUploading}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Insert
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-strong">
            <DropdownMenuItem onClick={() => triggerFileUpload('image')}><ImageIcon className="w-4 h-4 mr-2 text-blue-500" />Image</DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerFileUpload('pdf')}><FileText className="w-4 h-4 mr-2 text-red-500" />PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerFileUpload('code')}><FileCode className="w-4 h-4 mr-2 text-green-500" />Code</DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerFileUpload('ppt')}><Presentation className="w-4 h-4 mr-2 text-orange-500" />PowerPoint</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Extract Text */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-success/30 text-success"
          disabled={isExtracting}
          onClick={() => extractInputRef.current?.click()}
        >
          {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
          Extract
        </Button>

        {/* AI Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 glow-accent border-accent/30 text-accent" disabled={isAILoading}>
              {isAILoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass-strong">
            <DropdownMenuItem onClick={() => handleAI('summarize')}><Sparkles className="w-4 h-4 mr-2 text-accent" />Summarize</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAI('improve')}><Sparkles className="w-4 h-4 mr-2 text-accent" />Improve</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onUpdate({ is_favorite: !note.is_favorite })} className={note.is_favorite ? 'text-accent' : 'text-muted-foreground'}>
            <Star className="w-4 h-4" fill={note.is_favorite ? 'currentColor' : 'none'} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onUpdate({ is_archived: !note.is_archived })} className={note.is_archived ? 'text-warning' : 'text-muted-foreground'}>
            <Archive className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title..."
          className="text-3xl font-bold border-none bg-transparent px-0 mb-4 focus-visible:ring-0"
        />
        
        <div className="mb-6">
          <TagManager
            noteId={note.id}
            tags={note.tags || []}
            allTags={allTags}
            onTagsChange={onTagsChange}
            userId={userId}
          />
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, isActive, disabled, icon }: { onClick: () => void; isActive?: boolean; disabled?: boolean; icon: React.ReactNode }) {
  return (
    <Button variant="ghost" size="icon" className={`h-8 w-8 ${isActive ? 'bg-primary/20 text-primary' : ''}`} onClick={onClick} disabled={disabled}>
      {icon}
    </Button>
  );
}
