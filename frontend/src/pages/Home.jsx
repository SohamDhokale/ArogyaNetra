import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Stethoscope,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  PieChart,
  Activity,
  UserCheck,
  Quote,
  MapPin,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const testimonials = [
    {
      name: "Dr. Rajesh Kulkarni",
      address: "Senior Cardiologist, Pune, Maharashtra",
      experience: "ArogyaNetra's SHAP explainability helped me understand that a patient's social support was a key risk factor I had overlooked. By addressing it before discharge, we prevented a likely readmission.",
      improvement: "25% reduction in readmissions in my ward."
    },
    {
      name: "Smt. Meera Bai",
      address: "Patient Family Member, Kumbhivali, Raigad",
      experience: "The system's early warning alerted the doctors about my husband's rising risk levels 2 days before discharge. They adjusted his medication, and he has been healthy at home for 3 months now.",
      improvement: "Complete recovery without emergency visits."
    },
    {
      name: "Dr. Ananya Sharma",
      address: "Chief of Medicine, New Delhi",
      experience: "Transitioning from reactive care to proactive AI-driven intelligence was seamless. The localized Indian data models make a huge difference in accuracy for our patient demographic.",
      improvement: "94% prediction accuracy across 500+ cases."
    }
  ];

  return (
    <div className="bg-cream-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-700 text-xs font-black mb-8 tracking-[0.2em] uppercase">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping"></span>
                Next-Gen Clinical Intelligence
              </div>
              <h1 className="text-6xl lg:text-7xl font-heading font-black text-slate-900 leading-[1.1] mb-8">
                Proactive Care for <span className="text-blue-600 italic">Every Indian</span> Life.
              </h1>
              <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                ArogyaNetra empowers healthcare providers with explainable AI to predict readmission risks, saving lives and reducing the ₹1.4 Lakh Crore burden on Indian hospitals.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <Link
                  to="/apollo-booking"
                  className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 group"
                >
                  Book Appointment <Calendar size={20} className="group-hover:rotate-12 transition-transform" />
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-3 shadow-lg shadow-slate-200/50 active:scale-95"
                >
                  Clinical Login <UserCheck size={20} />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 bg-white/40 backdrop-blur-sm rounded-[3rem] p-4 border border-white/50 shadow-2xl overflow-hidden group">
                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
                    alt="Clinical Excellence" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-4 text-white">
                      <div className="bg-blue-600 p-3 rounded-2xl shadow-xl">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-80">Real-time Risk Analysis</div>
                        <div className="text-xl font-bold">94% Prediction Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-cream-200/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Economic Impact", value: "₹1.4T", sub: "Annual Savings Potential" },
              { label: "Clinical Accuracy", value: "94%", sub: "Validated AI Models" },
              { label: "Response Time", value: "<2s", sub: "Real-time Processing" },
              { label: "Trusted Partners", value: "12+", sub: "Top Indian Hospitals" }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-4xl lg:text-5xl font-heading font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{stat.value}</div>
                <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Experiences */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Success Stories</h2>
            <h3 className="text-5xl font-heading font-bold text-slate-900 mb-8 leading-tight">Impact on the Ground: Indian Healthcare Transformed</h3>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col relative"
              >
                <Quote className="absolute top-8 right-8 text-blue-100" size={60} />
                <div className="flex items-center gap-2 text-blue-600 mb-6">
                  <MapPin size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">{t.address}</span>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-10 italic font-medium relative z-10">
                  "{t.experience}"
                </p>
                <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl">{t.name}</h4>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm mt-1">
                      <CheckCircle2 size={16} />
                      {t.improvement}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8 relative z-10">Experience the Future of Care Today</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium relative z-10">
            Whether you are a healthcare professional or a patient family member, our system is here to ensure the best possible clinical outcomes.
          </p>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <Link to="/apollo-booking" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 active:scale-95">
              Book Appointment Now
            </Link>
            <Link to="/contact" className="bg-transparent text-white px-12 py-5 rounded-2xl font-black text-xl border-2 border-white/20 hover:bg-white/5 transition-all">
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-20 bg-white border-t border-cream-200/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <Link to="/" className="flex items-center gap-3">
              <img src="/src/assets/logo.svg" alt="Logo" className="h-10 w-auto" />
              <span className="text-2xl font-black font-heading tracking-tight">ArogyaNetra</span>
            </Link>
            <div className="flex gap-10 text-slate-500 font-bold text-sm uppercase tracking-widest">
              <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
              <Link to="/partners" className="hover:text-blue-600 transition-colors">Partners</Link>
              <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
              <Link to="/login" className="hover:text-blue-600 transition-colors">Portal</Link>
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
              © 2026 ArogyaNetra Healthcare AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
