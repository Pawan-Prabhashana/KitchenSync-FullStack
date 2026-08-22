import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChefHat } from 'lucide-react';
import { DEMO_USERS } from '../data/menu';
import { User } from '../types';
import { api, ApiError, DEMO_PASSWORD } from '../lib/api';
import { Avatar } from '../components/Avatar';

interface LoginPageProps {
  onAuthSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const doLogin = async (emailArg: string, passwordArg: string) => {
    setBusy(true);
    setError('');
    try {
      const { user } = await api.login(emailArg, passwordArg);
      onAuthSuccess(user);
    } catch (err) {
      if (err instanceof ApiError && err.isNetwork) {
        setError('Cannot reach the API. Is the server running on port 4000? (npm run server)');
      } else if (err instanceof ApiError && err.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err instanceof Error ? err.message : 'Login failed.');
      }
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    'w-full mt-1 p-2.5 text-sm bg-canvas border border-hairline rounded-xl text-ink placeholder-faint focus:outline-none focus:ring-2 focus:ring-green-dot/40 focus:border-green-dot transition-all';

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md p-7 bg-surface rounded-card shadow-soft-lg border border-hairline"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-charcoal text-white flex items-center justify-center">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink leading-none">KitchenSync</h2>
            <p className="text-xs text-muted mt-1">Sign in to continue</p>
          </div>
        </div>

        <p className="text-sm text-muted mb-4">
          Use a demo account below, or sign in with a demo email (password{' '}
          <code className="font-mono text-ink">{DEMO_PASSWORD}</code>).
        </p>

        <form onSubmit={(e) => { e.preventDefault(); doLogin(email, password); }} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@kitchensync.com" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder={DEMO_PASSWORD} className={inputCls} />
          </div>

          {error && <div className="text-xs text-coral-ink font-medium">{error}</div>}

          <button disabled={busy}
            className="w-full py-2.5 bg-charcoal hover:bg-charcoal-hover disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-faint mb-2">Quick demo logins</div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.slice(0, 6).map(u => (
              <button key={u.id} disabled={busy} onClick={() => doLogin(u.email, DEMO_PASSWORD)}
                className="p-2 rounded-xl border border-hairline text-left flex items-center gap-2 hover:bg-canvas disabled:opacity-60 transition-colors">
                <Avatar name={u.name} role={u.role} size="sm" />
                <span className="text-xs font-medium text-ink truncate">{u.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-muted">
          <a href="#/signup" className="text-green-ink font-medium">Create an account</a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
