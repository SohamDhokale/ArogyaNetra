import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, ShieldCheck, HeartPulse, Sparkles, Building2, UserPlus, FileSearch, ChartBar, MapPin, ExternalLink } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-extrabold mb-8"
          >
            Revolutionizing <span className="text-blue-400 italic">Healthcare Decision Support</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            ArogyaNetra is an AI-first clinical intelligence platform dedicated to reducing patient readmission rates and improving clinical outcomes through explainable predictive modeling.
          </motion.p>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-blue-600 font-bold uppercase tracking-wider mb-4">The Challenge</h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">Solving the ₹1.4 Lakh Crore Readmission Problem</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Hospital readmissions within 30 days are a significant burden on both healthcare systems and patients. In India alone, these avoidable readmissions cost the healthcare sector over ₹1.4 Lakh Crore annually, straining resources and increasing patient out-of-pocket expenses.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Most clinical systems today are reactive. ArogyaNetra shifts the paradigm by providing proactive, AI-driven insights before the patient is even discharged, tailored specifically for the diverse Indian clinical landscape.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-3xl font-black text-blue-600 mb-2">30%</div>
                  <div className="text-sm font-bold text-slate-900 uppercase">Cost Reduction</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-3xl font-black text-blue-600 mb-2">94%</div>
                  <div className="text-sm font-bold text-slate-900 uppercase">Accuracy Rate</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-blue-600/5 absolute inset-0 rounded-3xl -rotate-3 scale-105"></div>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative z-10 space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                    <Target size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Our Mission</h4>
                    <p className="text-slate-600 leading-relaxed">To empower every clinician with AI-driven insights that save lives and optimize healthcare resources.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
                    <Users size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Clinician First</h4>
                    <p className="text-slate-600 leading-relaxed">Designed by AI engineers in collaboration with healthcare professionals to fit seamlessly into the clinical workflow.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Data Ethics</h4>
                    <p className="text-slate-600 leading-relaxed">Committed to the highest standards of HIPAA compliance and bias monitoring across age and gender.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-blue-400 font-bold uppercase tracking-wider mb-4">Our Academic Home</h2>
                <h3 className="text-4xl font-bold mb-8 leading-tight">Vishwaniketan's iMEET, Kumbhivali</h3>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                  ArogyaNetra was born in the innovation labs of Vishwaniketan's Institute of Management Entrepreneurship and Engineering Technology. Our research and development continue to be driven by the bright minds at this premier institution.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-blue-600/20 p-3 rounded-xl text-blue-400">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Address</h4>
                      <p className="text-slate-400">Survey No. 52, Kumbhivali, Near Khalapur Toll Naka, Mumbai-Pune Expressway, Khalapur, Raigad, Maharashtra 410202</p>
                    </div>
                  </div>
                  
                  <a 
                    href="https://www.google.com/maps/place/Vishwaniketan's+iMEET/@18.8475518,73.3006414,17z" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-all active:scale-95"
                  >
                    View on Google Maps <ExternalLink size={18} />
                  </a>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700 h-[400px]">
                <iframe 
                  src="https://maps.google.com/maps?q=Vishwaniketan's%20iMEET%20Kumbhivali&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vishwaniketan iMEET Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-blue-600 font-bold uppercase tracking-wider mb-4">Our Technology</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Advanced Analytics, Human Explanations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Sparkles className="text-blue-600" />, title: "XGBoost & LSTM", desc: "Multi-layer architecture combining structured tabular data with temporal patient history." },
              { icon: <FileSearch className="text-indigo-600" />, title: "SHAP Explainability", desc: "Transforming 'Black Box' predictions into human-readable clinical feature importance." },
              { icon: <ChartBar className="text-emerald-600" />, title: "SMOTE Handling", desc: "Advanced data balancing techniques to handle rare clinical events accurately." },
              { icon: <Building2 className="text-purple-600" />, title: "PostgreSQL Backend", desc: "Enterprise-grade database structure for HIPAA-compliant patient data storage." }
            ].map((tech, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">{tech.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
