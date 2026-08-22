import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';
import { User, Role } from '../types';
import { api, ApiError } from '../lib/api';

interface SignupPageProps {
  onAuthSuccess: (user: User) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('waiter');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { user } = await api.register({ name, email, password, role });
      onAuthSuccess(user);
    } catch (err) {
      if (err instanceof ApiError && err.isNetwork) {
        setError('Cannot reach the API. Is the server running on port 4000? (npm run server)');
      } else if (err instanceof ApiError && err.code === 'EMAIL_TAKEN') {
        setError('An account with that email already exists. Try signing in.');
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed.');
      }
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    'w-full mt-1 p-2.5 text-sm bg-canvas border border-hairline rounded-xl text-ink placeholder-faint focus:outline-none focus:ring-2 focus:ring-green-dot/40 focus:border-green-dot transition-all';
  const roles: Role[] = ['waiter', 'chef', 'rider'];

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
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink leading-none">Create an account</h2>
            <p className="text-xs text-muted mt-1">Register a staff persona</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted">Full name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Alex Mercer" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@kitchensync.com" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Password</label>
            <input type="password" required minLength={4} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Role</label>
            <div className="flex gap-2 mt-2">
              {roles.map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${
                    role === r ? 'bg-charcoal text-white border-charcoal' : 'bg-canvas text-muted border-hairline hover:text-ink'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-xs text-coral-ink font-medium">{error}</div>}

          <button disabled={busy}
            className="w-full py-2.5 bg-charcoal hover:bg-charcoal-hover disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-muted">
          <a href="#/login" className="text-green-ink font-medium">Have an account? Sign in</a>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
