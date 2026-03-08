import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Eye, EyeOff } from 'lucide-react';

export function LoginPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error ?? 'Invalid email or password');
      }
      setLoading(false);
    }, 800);
  };

  const demoAccounts = [
    { email: 'admin@goldlink.ph', password: 'admin123', role: 'Admin' },
    { email: 'hr@goldlink.ph', password: 'hr123', role: 'HR Officer' },
    { email: 'supervisor@goldlink.ph', password: 'super123', role: 'Supervisor' },
    { email: 'employee@goldlink.ph', password: 'emp123', role: 'Employee' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/20 mx-auto mb-4">
            <Shield className="text-brand-primary" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">GoldLink Infratek</h1>
          <p className="text-sm text-[#A3A3A3] mt-1">Attendance Monitoring & Payroll System</p>
        </div>

        {/* Login Form */}
        <div className="bg-[rgb(36,36,36)] border border-[rgb(55,55,55)] rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#FAFAFA]">Sign in to ARIA</h2>
            <p className="text-sm text-[#A3A3A3]">Enter your credentials to access the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#FAFAFA]">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@goldlink.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#FAFAFA]">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#FAFAFA]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-[rgb(36,36,36)] border border-[rgb(55,55,55)] rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                className="text-left px-3 py-2 rounded-lg bg-[rgb(26,26,26)] hover:bg-brand-primary/10 border border-[rgb(55,55,55)] hover:border-brand-primary/30 transition-colors"
              >
                <p className="text-xs font-medium text-brand-primary">{account.role}</p>
                <p className="text-[10px] text-[#A3A3A3] truncate">{account.email}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#A3A3A3]">
          © 2026 GoldLink Infratek Corporation
        </p>
      </div>
    </div>
  );
}
