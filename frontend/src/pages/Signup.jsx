import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle, Stethoscope } from 'lucide-react';
import logo from '../assets/logo.svg';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Doctor'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        role: formData.role,
        email: formData.email
      }));
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div>
            <div className="flex items-center mb-8">
              <img src={logo} alt="ArogyaNetra Logo" className="h-16 w-auto" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your clinical account</h2>
            <p className="mt-3 text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest ml-1 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={20} />
                  </div>
                  <input
                    required
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                    placeholder="Dr. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest ml-1 mb-2">
                  Clinical Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={20} />
                  </div>
                  <input
                    required
                    type="email"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                    placeholder="name@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest ml-1 mb-2">
                  Clinical Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Stethoscope size={20} />
                  </div>
                  <select 
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none text-slate-900"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option>Doctor</option>
                    <option>Nurse Practitioner</option>
                    <option>Risk Analyst</option>
                    <option>Admin</option>
                  </select>
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
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input required type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-slate-500">
                    I agree to the <a href="#" className="font-bold text-blue-600">Terms of Service</a> and acknowledge the <a href="#" className="font-bold text-blue-600">HIPAA Privacy Policy</a>.
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-3 py-4 px-4 bg-blue-600 border border-transparent rounded-2xl shadow-xl shadow-blue-500/20 text-lg font-bold text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : (
                    <>Join ArogyaNetra <ArrowRight size={20} /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Visual/Marketing */}
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900">
        <div className="absolute inset-0 h-full w-full">
          <img
            className="h-full w-full object-cover grayscale opacity-40 mix-blend-luminosity"
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
            alt="Healthcare professionals"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-slate-900/90"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 backdrop-blur p-2 rounded-lg border border-white/20">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <span className="text-white font-bold uppercase tracking-widest text-sm">Enterprise Grade AI</span>
            </div>
            <h3 className="text-5xl font-black text-white leading-tight mb-8">
              Empowering clinicians with <span className="text-blue-400 italic">Explainable Intelligence</span>.
            </h3>
            <div className="space-y-6">
              {[
                "Reduce 30-day readmissions by up to 25%",
                "Explainable SHAP-based risk scoring",
                "Automated clinical follow-up planning",
                "Secure HIPAA-compliant environment"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-blue-100/80">
                  <CheckCircle className="text-blue-400 flex-shrink-0" size={20} />
                  <span className="font-medium text-lg">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
