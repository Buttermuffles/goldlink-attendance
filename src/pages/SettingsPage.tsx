import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { Shield, Palette, Bell, Globe, Database } from 'lucide-react';

export function SettingsPage(): React.ReactElement {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Settings</h1>
        <p className="text-sm text-[#A3A3A3]">System configuration and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} className="text-brand-primary" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#FAFAFA]">Name</label>
              <Input defaultValue={user?.name ?? ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#FAFAFA]">Email</label>
              <Input defaultValue={user?.email ?? ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#FAFAFA]">Role</label>
              <Input defaultValue={user?.role ?? ''} disabled className="uppercase" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={18} className="text-brand-primary" />
            System
          </CardTitle>
          <CardDescription>Application settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[rgb(55,55,55)]">
            <div>
              <p className="text-sm font-medium text-[#FAFAFA]">Timezone</p>
              <p className="text-xs text-[#A3A3A3]">Asia/Manila (UTC+8)</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[rgb(55,55,55)]">
            <div>
              <p className="text-sm font-medium text-[#FAFAFA]">Currency</p>
              <p className="text-xs text-[#A3A3A3]">Philippine Peso (₱)</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[rgb(55,55,55)]">
            <div>
              <p className="text-sm font-medium text-[#FAFAFA]">Geo-fence Default Radius</p>
              <p className="text-xs text-[#A3A3A3]">100 meters</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={18} className="text-brand-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Theme and display settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border-2 border-brand-primary" title="Dark (Active)" />
              <span className="text-sm text-[#FAFAFA]">Dark</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-[rgb(55,55,55)]" title="Light (Coming Soon)" />
              <span className="text-sm text-[#A3A3A3]">Light (Soon)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={18} className="text-brand-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['Email notifications', 'Push notifications', 'Late arrival alerts', 'Payroll ready alerts'].map((label) => (
            <div key={label} className="flex items-center justify-between py-2">
              <span className="text-sm text-[#FAFAFA]">{label}</span>
              <div className="w-10 h-6 rounded-full bg-brand-primary/30 flex items-center px-1 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-brand-primary ml-auto" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <Database size={18} />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#FAFAFA]">Reset Demo Data</p>
              <p className="text-xs text-[#A3A3A3]">Restore all mock data to defaults</p>
            </div>
            <Button variant="destructive" size="sm">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
