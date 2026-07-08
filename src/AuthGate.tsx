import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

type AuthState =
  | { status: 'loading' }
  | { status: 'signed-out'; error?: string }
  | { status: 'signed-in'; user: User };

export function AuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setState(user ? { status: 'signed-in', user } : { status: 'signed-out' });
    });
  }, []);

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-300">
        <div className="text-sm tracking-wide">Loading Kitchen Lab OS…</div>
      </div>
    );
  }

  if (state.status === 'signed-out') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 p-6">
        <div className="w-full max-w-sm border border-neutral-800 rounded-lg p-8 bg-neutral-900 shadow-lg">
          <h1 className="text-xl font-semibold mb-1">Kitchen Lab OS</h1>
          <p className="text-sm text-neutral-400 mb-6">Sign in to continue.</p>
          <button
            type="button"
            onClick={async () => {
              try {
                await signInWithPopup(auth, googleProvider);
              } catch (err) {
                setState({
                  status: 'signed-out',
                  error: err instanceof Error ? err.message : 'Sign-in failed',
                });
              }
            }}
            className="w-full py-2.5 rounded-md bg-white text-neutral-900 font-medium hover:bg-neutral-200 transition"
          >
            Continue with Google
          </button>
          {state.error && (
            <p className="mt-4 text-xs text-red-400">{state.error}</p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
