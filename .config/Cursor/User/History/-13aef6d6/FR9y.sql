-- ============================================
-- Fix RLS Policies for NoteForge AI
-- Run this in Supabase SQL Editor to fix create note/folder errors
-- ============================================

-- ============================================
-- STEP 1: Drop all existing policies
-- ============================================

-- Drop notes policies
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can create own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes;

-- Drop folders policies
DROP POLICY IF EXISTS "Users can view own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can create own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can update own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can delete own folders" ON public.folders;

-- Drop profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Drop tags policies
DROP POLICY IF EXISTS "Users can view own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can create own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can update own tags" ON public.tags;
DROP POLICY IF EXISTS "Users can delete own tags" ON public.tags;

-- Drop note_tags policies
DROP POLICY IF EXISTS "Users can view note tags for own notes" ON public.note_tags;
DROP POLICY IF EXISTS "Users can add tags to own notes" ON public.note_tags;
DROP POLICY IF EXISTS "Users can remove tags from own notes" ON public.note_tags;

-- Drop user_settings policies
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can create own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;

-- ============================================
-- STEP 2: Ensure RLS is enabled
-- ============================================

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Create new policies (FIXED)
-- ============================================

-- NOTES POLICIES (Most Important - Fixes "Create Note" error)
CREATE POLICY "Users can view own notes" 
ON public.notes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes" 
ON public.notes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" 
ON public.notes FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" 
ON public.notes FOR DELETE 
USING (auth.uid() = user_id);

-- FOLDERS POLICIES (Fixes "Create Folder" error)
CREATE POLICY "Users can view own folders" 
ON public.folders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own folders" 
ON public.folders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders" 
ON public.folders FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders" 
ON public.folders FOR DELETE 
USING (auth.uid() = user_id);

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- TAGS POLICIES
CREATE POLICY "Users can view own tags" 
ON public.tags FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tags" 
ON public.tags FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" 
ON public.tags FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" 
ON public.tags FOR DELETE 
USING (auth.uid() = user_id);

-- NOTE_TAGS POLICIES
CREATE POLICY "Users can view note tags for own notes" 
ON public.note_tags FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.notes 
    WHERE notes.id = note_tags.note_id 
    AND notes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add tags to own notes" 
ON public.note_tags FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.notes 
    WHERE notes.id = note_tags.note_id 
    AND notes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove tags from own notes" 
ON public.note_tags FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.notes 
    WHERE notes.id = note_tags.note_id 
    AND notes.user_id = auth.uid()
  )
);

-- USER_SETTINGS POLICIES
CREATE POLICY "Users can view own settings" 
ON public.user_settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own settings" 
ON public.user_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
ON public.user_settings FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 4: Verify policies were created
-- ============================================

-- This query will show all policies (run separately to verify)
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname;

