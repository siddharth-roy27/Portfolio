'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/AnimatedBackground';
import {
  ArrowLeft,
  User,
  Settings as SettingsIcon,
  CreditCard,
  Crown,
  Loader2,
  ExternalLink,
} from 'lucide-react';

// Stripe price ID for NoteForge Pro subscription
const PRO_PRICE_ID = 'price_1Se3OjPEPfW19pZoEwc2zAyp';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<{ display_name: string; avatar_url: string } | null>(null);
  const [settings, setSettings] = useState({
    theme: 'dark',
    editor_font_size: 16,
    auto_save: true,
    ai_suggestions: true,
  });
  const [subscription, setSubscription] = useState<{ subscribed: boolean; subscription_end?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
      checkSubscription();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (settingsData) {
        setSettings({
          theme: settingsData.theme || 'dark',
          editor_font_size: settingsData.editor_font_size || 16,
          auto_save: settingsData.auto_save ?? true,
          ai_suggestions: settingsData.ai_suggestions ?? true,
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async () => {
    setIsCheckingSubscription(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session found');
      }

      const response = await fetch('/api/stripe/check-subscription', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check subscription');
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      console.error('Error checking subscription:', err);
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast({ title: 'Profile updated' });
    } catch (err) {
      console.error('Error saving profile:', err);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
        });

      if (error) throw error;
      
      // Persist theme to localStorage so Navbar/other UI can pick it up on reload
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', settings.theme);
          document.documentElement.classList.toggle('dark', settings.theme === 'dark');
        }
      } catch (e) {
        // ignore
      }

      toast({ title: 'Settings saved' });
    } catch (err) {
      console.error('Error saving settings:', err);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session found');
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId: PRO_PRICE_ID }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout');
      }

      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      console.error('Error creating checkout:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to start checkout',
        variant: 'destructive',
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session found');
      }

      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to open portal');
      }

      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      console.error('Error opening portal:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to open billing portal',
        variant: 'destructive',
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view settings.</p>
          <Button onClick={() => router.push('/auth')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <SettingsIcon className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label>Avatar URL</Label>
                    <Input
                      value={profile?.avatar_url || ''}
                      onChange={(e) => setProfile(p => p ? { ...p, avatar_url: e.target.value } : { display_name: '', avatar_url: e.target.value })}
                      placeholder="https://..."
                      className="glass mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Display Name</Label>
                  <Input
                    value={profile?.display_name || ''}
                    onChange={(e) => setProfile(p => p ? { ...p, display_name: e.target.value } : { display_name: e.target.value, avatar_url: '' })}
                    placeholder="Your name"
                    className="glass mt-1"
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled className="glass mt-1 opacity-50" />
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save notes as you type</p>
                  </div>
                  <Switch
                    checked={settings.auto_save}
                    onCheckedChange={(checked) => setSettings(s => ({ ...s, auto_save: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Suggestions</Label>
                    <p className="text-sm text-muted-foreground">Show AI-powered writing suggestions</p>
                  </div>
                  <Switch
                    checked={settings.ai_suggestions}
                    onCheckedChange={(checked) => setSettings(s => ({ ...s, ai_suggestions: checked }))}
                  />
                </div>

                <div>
                  <Label>Editor Font Size</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      type="number"
                      min={12}
                      max={24}
                      value={settings.editor_font_size}
                      onChange={(e) => setSettings(s => ({ ...s, editor_font_size: parseInt(e.target.value) || 16 }))}
                      className="glass w-24"
                    />
                    <span className="text-sm text-muted-foreground">pixels</span>
                  </div>
                </div>

                <div>
                  <Label>Theme</Label>
                  <select
                    className="w-48 p-2 rounded border bg-background mt-2"
                    value={settings.theme}
                    onChange={(e) => setSettings(s => ({ ...s, theme: e.target.value }))}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-accent" />
                  Subscription
                </CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isCheckingSubscription ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking subscription status...
                  </div>
                ) : subscription?.subscribed ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Crown className="w-5 h-5" />
                      <span className="font-medium">Pro Plan Active</span>
                    </div>
                    {subscription.subscription_end && (
                      <p className="text-sm text-muted-foreground">
                        Renews on {new Date(subscription.subscription_end).toLocaleDateString()}
                      </p>
                    )}
                    <Button variant="outline" onClick={handleManageSubscription} className="gap-2">
                      Manage Subscription
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-accent/30 bg-accent/10">
                      <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-accent" />
                        Upgrade to Pro
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Unlimited AI features</li>
                        <li>• Text extraction from PDF & PPT</li>
                        <li>• Priority support</li>
                        <li>• Advanced organization</li>
                      </ul>
                      <p className="text-2xl font-bold mb-4">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      <Button onClick={handleSubscribe} className="gap-2">
                        <Crown className="w-4 h-4" />
                        Subscribe Now
                      </Button>
                    </div>
                    <Button variant="ghost" onClick={checkSubscription} className="text-sm">
                      Refresh subscription status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
