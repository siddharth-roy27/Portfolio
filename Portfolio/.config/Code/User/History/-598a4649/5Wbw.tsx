'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // no row
          setSettings(null);
        } else if (error) {
          setError(error.message);
        } else {
          setSettings(data);
        }
      } catch (e) {
        setError('Failed to load settings');
      }
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        user_id: user.id,
        theme: settings?.theme || 'dark',
        editor_font_size: Number(settings?.editor_font_size || 16),
        auto_save: !!settings?.auto_save,
        ai_suggestions: !!settings?.ai_suggestions,
      };

      // Use upsert to avoid duplicate key errors on `user_id` unique constraint
      const { error: upsertError, data: upsertData } = await supabase
        .from('user_settings')
        .upsert(payload, { returning: 'representation' });

      if (upsertError) throw upsertError;
      // keep local settings in sync with DB
      if (upsertData && upsertData[0]) setSettings(upsertData[0]);

      // Persist theme to localStorage so Navbar/other UI can pick it up on reload
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', payload.theme);
          document.documentElement.classList.toggle('dark', payload.theme === 'dark');
        }
      } catch (e) {
        // ignore
      }

    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">Please sign in to view settings.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="mb-6 p-4 rounded-lg border border-border/30 glass">
        <label className="block mb-2 font-medium">Theme</label>
        <select
          className="w-48 p-2 rounded border bg-background"
          value={settings?.theme || 'dark'}
          onChange={(e) => setSettings((s: any) => ({ ...(s || {}), theme: e.target.value }))}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div className="mb-6 p-4 rounded-lg border border-border/30 glass flex items-center justify-between">
        <div>
          <div className="font-medium">Auto Save</div>
          <div className="text-sm text-muted-foreground">Automatically save notes as you type</div>
        </div>
        <Switch
          checked={!!settings?.auto_save}
          onCheckedChange={(val) => setSettings((s: any) => ({ ...(s || {}), auto_save: val }))}
        />
      </div>

      <div className="mb-6 p-4 rounded-lg border border-border/30 glass flex items-center justify-between">
        <div>
          <div className="font-medium">AI Suggestions</div>
          <div className="text-sm text-muted-foreground">Enable inline AI suggestions</div>
        </div>
        <Switch
          checked={!!settings?.ai_suggestions}
          onCheckedChange={(val) => setSettings((s: any) => ({ ...(s || {}), ai_suggestions: val }))}
        />
      </div>

      <div className="mb-6 p-4 rounded-lg border border-border/30 glass">
        <label className="block mb-2 font-medium">Editor font size</label>
        <Input
          type="number"
          value={settings?.editor_font_size || 16}
          onChange={(e) => setSettings((s: any) => ({ ...(s || {}), editor_font_size: e.target.value }))}
          className="w-32"
        />
      </div>

      {error && <div className="text-destructive mb-4">{error}</div>}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
      </div>
    </div>
  );
}
