import React from 'react';
import { motion } from 'framer-motion';
import { Building2, PlusCircle, ExternalLink, Activity, Heart, ShieldCheck, Zap } from 'lucide-react';

const Partners = () => {
  const partners = [
    { name: 'Apollo Hospitals', logo: 'https://brandlogovector.com/wp-content/uploads/2021/04/Apollo-Hospitals-Logo-Small.png', type: 'Primary Partner', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Fortis Healthcare', logo: 'https://logowik.com/content/uploads/images/fortis-healthcare6714.jpg', type: 'Clinical Trial Site', color: 'bg-red-50 text-red-600' },
    { name: 'Max Healthcare', logo: 'https://www.google.com/s2/favicons?domain=maxhealthcare.in&sz=128', type: 'Network Provider', color: 'bg-blue-50 text-blue-600' },
    { name: 'Manipal Hospitals', logo: 'https://www.google.com/s2/favicons?domain=manipalhospitals.com&sz=128', type: 'Implementation Site', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Religare Insurance', logo: 'https://media.licdn.com/dms/image/v2/C510BAQFhrIIRyV3Vgw/company-logo_200_200/company-logo_200_200/0/1630628920524/religare_health_insurance_logo?e=2147483647&v=beta&t=1JUO_42YmBTGoP0jv1zLCBanqjycnSNT50LQLEt08gE', type: 'Insurance Partner', color: 'bg-orange-50 text-orange-600' },
    { name: 'Care Health', logo: 'https://supremusangel.com/assets/frontend/img/productimg/care-health-insurance-pre-ipo-shares-logo.webp', type: 'Risk Analyst Partner', color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="py-24 bg-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-8"
          >
            Our Ecosystem <span className="text-blue-100 italic">& Partners</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed"
          >
            We collaborate with the world's leading healthcare providers, insurers, and EHR systems to make predictive intelligence accessible everywhere.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-2xl transition-all group hover:-translate-y-2 duration-300 flex flex-col items-center text-center"
              >
                <div className="h-24 w-full flex items-center justify-center mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 relative">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-w-[150px] h-auto opacity-70 group-hover:opacity-100 transition-all z-10"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className={`hidden absolute inset-0 items-center justify-center rounded-2xl font-black text-2xl ${partner.color}`}
                    aria-hidden="true"
                  >
                    {partner.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{partner.name}</h3>
                    <p className="text-sm font-semibold text-blue-600">{partner.type}</p>
                  </div>
                  <button className="text-slate-400 hover:text-blue-600 transition-colors">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 scale-150"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-8 max-w-2xl mx-auto">Become a Partner in the Healthcare Revolution</h2>
              <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">Join over 20+ institutions leveraging ArogyaNetra to optimize clinical resources and improve patient care standards.</p>
              <button className="bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto">
                <PlusCircle size={24} /> Register as Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="text-center">
            <Activity className="text-blue-600 mx-auto mb-4" size={32} />
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Live Integration</h4>
            <div className="text-2xl font-black text-slate-800 italic">250+ EHRs</div>
          </div>
          <div className="text-center">
            <Heart className="text-emerald-600 mx-auto mb-4" size={32} />
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Lives Saved</h4>
            <div className="text-2xl font-black text-slate-800 italic">15,000+</div>
          </div>
          <div className="text-center">
            <ShieldCheck className="text-indigo-600 mx-auto mb-4" size={32} />
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Compliance</h4>
            <div className="text-2xl font-black text-slate-800 italic">HIPAA/GDPR</div>
          </div>
          <div className="text-center">
            <Zap className="text-amber-600 mx-auto mb-4" size={32} />
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Analysis Time</h4>
            <div className="text-2xl font-black text-slate-800 italic">&lt; 2 SECS</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
