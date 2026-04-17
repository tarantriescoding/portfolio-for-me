'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, Terminal, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the admin password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'true');
        toast.success('Welcome back, Admin!');
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
        toast.error(data.error || 'Authentication failed');
      }
    } catch {
      setError('Something went wrong');
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="admin-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#10b981" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-grid)" />
        </svg>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-zinc-500 text-sm font-mono flex items-center justify-center gap-1">
              <Terminal className="w-3 h-3" />
              <span>Authorization required</span>
            </p>
          </div>

          {/* Terminal-style prompt */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 mb-6">
            <p className="text-zinc-500 text-xs font-mono">
              <span className="text-emerald-500">$</span> authenticate --role=admin
            </p>
            <p className="text-zinc-600 text-xs font-mono mt-1">
              Enter password to access the admin panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-zinc-400 text-sm font-mono">
                <span className="text-emerald-500">$</span> password{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin password"
                  className="pl-10 pr-10 bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 font-mono text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2"
              >
                <span className="text-red-500 mr-1">{'>'}</span> {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-zinc-600 hover:text-zinc-400 font-mono text-xs"
            >
              {'< '}Back to Portfolio
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
