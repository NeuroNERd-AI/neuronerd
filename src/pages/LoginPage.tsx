import { Link } from 'react-router-dom';
import { Brain, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Brain className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">NeuroNERd</h1>
          <p className="mt-1 text-sm text-slate-500">Caregiver Dashboard</p>
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue to your dashboard.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <input type="email" className="input mt-1.5" placeholder="you@example.com" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input type="password" className="input mt-1.5" placeholder="Enter your password" />
            </label>
            <button type="submit" className="btn-primary w-full">Sign in</button>
          </form>
          <div className="mt-6 flex items-start gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            <span>Access is limited to caregivers and authorized healthcare workers.</span>
          </div>
        </div>
        <Link to="/dashboard" className="mt-5 block text-center text-sm text-blue-600 hover:text-blue-700">
          Continue to prototype dashboard
        </Link>
      </div>
    </div>
  );
}
