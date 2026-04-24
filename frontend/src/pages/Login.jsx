import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Globe, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate auth with superuser check
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@arogyanetra.ai' && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({
          name: 'Super Admin',
          role: 'Chief Administrator',
          email: email
        }));
        navigate('/dashboard');
      } else {
        // For other logins in this demo, use a generic name
        localStorage.setItem('user', JSON.stringify({
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          role: 'Clinician',
          email: email
        }));
        navigate('/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center">
            <img src={logo} alt="ArogyaNetra Logo" className="h-20 w-auto" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to ArogyaNetra
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
            create a new clinical account
          </Link>
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100"
        >
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl text-blue-700 text-xs">
            <p className="font-bold mb-1">Superuser Access Enabled</p>
            <p>Email: <span className="font-mono">admin@arogyanetra.ai</span></p>
            <p>Password: <span className="font-mono">admin123</span></p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest ml-1 mb-2">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                  placeholder="name@hospital.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest ml-1 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                <label className="ml-2 block text-sm text-slate-600 font-medium">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-bold text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-4 px-4 bg-blue-600 border border-transparent rounded-2xl shadow-xl shadow-blue-500/20 text-lg font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Signing in...' : (
                  <>Sign in <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <Globe size={20} className="text-red-500" />
                Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <User size={20} />
                GitHub
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
