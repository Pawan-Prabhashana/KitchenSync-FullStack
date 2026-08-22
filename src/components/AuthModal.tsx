import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Shield } from 'lucide-react';
import { User, Role } from '../types';
import { DEMO_USERS, DEMO_RIDERS } from '../data/menu';
import { api, ApiError, DEMO_PASSWORD } from '../lib/api';
import { Avatar } from './Avatar';

interface AuthModalProps {
  currentUser: User | null;
  onClose: () => void;
  onUserChanged: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentUser, onClose, onUserChanged }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('chef');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const describeError = (err: unknown): string => {
    if (err instanceof ApiError && err.isNetwork) return 'Cannot reach the API (start it with npm run server).';
    if (err instanceof ApiError && err.status === 401) return 'Invalid email or password.';
    if (err instanceof ApiError && err.code === 'EMAIL_TAKEN') return 'That email is already registered.';
    return err instanceof Error ? err.message : 'Authentication failed.';
  };

  const quickLogin = async (user: User) => {
    setBusy(true); setError('');
    try {
      const { user: authed } = await api.login(user.email, DEMO_PASSWORD);
      onUserChanged(authed); onClose();
    } catch (err) { setError(describeError(err)); } finally { setBusy(false); }
  };

  const customAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const { user } = isRegistering
        ? await api.register({ name: name || 'Staff Member', email, password, role })
        : await api.login(email, password);
      onUserChanged(user); onClose();
    } catch (err) { setError(describeError(err)); } finally { setBusy(false); }
  };

  const groups: Array<{ label: string; users: User[]; role: Role }> = [
    { label: 'Chefs', users: DEMO_USERS.filter(u => u.role === 'chef'), role: 'chef' },
    { label: 'Waiters', users: DEMO_USERS.filter(u => u.role === 'waiter'), role: 'waiter' },
    { label: 'Riders', users: DEMO_RIDERS, role: 'rider' }
  ];

  const inputCls =
    'w-full text-xs p-2.5 bg-canvas border border-hairline rounded-xl text-ink placeholder-faint focus:outline-none focus:ring-2 focus:ring-green-dot/40 focus:border-green-dot';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs" onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Account and roles">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-card max-w-lg w-full shadow-soft-lg border border-hairline overflow-hidden max-h-[92vh] flex flex-col"
      >
        <div className="p-4 px-6 border-b border-hairline flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-green-chip text-green-ink flex items-center justify-center">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink">Account &amp; Roles</h2>
              <p className="text-xs text-muted">Switch persona (authenticates via the API)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-ink hover:bg-canvas rounded-lg" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto ks-scroll">
          <div className="space-y-3">
            {groups.map(group => (
              <div key={group.label}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-faint mb-1.5">{group.label}</div>
                <div className="grid grid-cols-3 gap-2">
                  {group.users.map(u => (
                    <button key={u.id} disabled={busy} onClick={() => quickLogin(u)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all disabled:opacity-60 ${
                        currentUser?.id === u.id ? 'border-green-dot bg-green-chip/40' : 'border-hairline hover:bg-canvas'
                      }`}>
                      <Avatar name={u.name} role={group.role} size="sm" />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-ink truncate">{u.name.split(' ')[0]}</div>
                        <div className="text-[10px] text-muted capitalize">{group.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-hairline" /></div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-surface px-2 text-faint font-semibold">Or sign in</span>
            </div>
          </div>

          <form onSubmit={customAuth} className="space-y-3">
            {isRegistering && (
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Full name" className={inputCls} />
            )}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" className={inputCls} />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegistering ? 'Choose a password' : `Demo: ${DEMO_PASSWORD}`} className={inputCls} />

            {isRegistering && (
              <div className="flex items-center gap-2">
                {(['chef', 'waiter', 'rider'] as Role[]).map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${
                      role === r ? 'bg-charcoal text-white border-charcoal' : 'bg-canvas text-muted border-hairline hover:text-ink'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            )}

            {error && <div className="text-xs text-coral-ink font-medium">{error}</div>}

            <button type="submit" disabled={busy}
              className="w-full py-2.5 bg-charcoal hover:bg-charcoal-hover disabled:opacity-60 text-white font-semibold text-xs rounded-xl transition-colors">
              {busy ? 'Please wait…' : isRegistering ? 'Register account' : 'Sign in as this user'}
            </button>

            <div className="text-center">
              <button type="button" onClick={() => setIsRegistering(v => !v)} className="text-xs text-green-ink font-medium hover:underline">
                {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
