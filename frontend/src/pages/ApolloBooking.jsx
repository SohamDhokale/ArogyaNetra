import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Stethoscope,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ApolloBooking = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: 'Cardiology',
    date: '',
    time: ''
  });

  const departments = [
    "Cardiology", "Diabetology", "Neurology", "General Medicine", "Pediatrics"
  ];

  const slots = [
    "09:00 AM", "10:30 AM", "11:00 AM", "02:00 PM", "04:30 PM"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="bg-cream-50 min-h-screen py-20 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Building2 size={14} /> Official Partner: Apollo Hospitals
          </div>
          <h1 className="text-5xl font-heading font-black text-slate-900 mb-6">Book Clinical Appointment</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto font-medium">
            Schedule a consultation or follow-up with India's leading specialists. Powered by ArogyaNetra's predictive priority system.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          <div className="flex border-b border-slate-50">
            <div className={`flex-1 py-6 text-center font-black text-xs uppercase tracking-widest ${step >= 1 ? 'text-blue-600 bg-blue-50/30' : 'text-slate-400'}`}>
              01. Details
            </div>
            <div className={`flex-1 py-6 text-center font-black text-xs uppercase tracking-widest ${step >= 2 ? 'text-blue-600 bg-blue-50/30' : 'text-slate-400'}`}>
              02. Schedule
            </div>
            <div className={`flex-1 py-6 text-center font-black text-xs uppercase tracking-widest ${step >= 3 ? 'text-blue-600 bg-blue-50/30' : 'text-slate-400'}`}>
              03. Confirm
            </div>
          </div>

          <div className="p-8 md:p-12">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Specialization</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setFormData({...formData, department: dept})}
                        className={`py-4 px-4 rounded-2xl font-bold text-sm transition-all ${formData.department === dept ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.phone}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Date</label>
                    <input 
                      type="date" 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold"
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Available Slots</label>
                    <div className="grid grid-cols-2 gap-3">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setFormData({...formData, time: slot})}
                          className={`py-3 px-2 rounded-xl font-bold text-xs transition-all ${formData.time === slot ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-10 flex gap-4">
                  <div className="bg-blue-600 text-white p-2 rounded-lg h-fit">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">ArogyaNetra Priority Alert</h4>
                    <p className="text-sm text-blue-700 font-medium">Based on your recent clinical history, our AI suggests an urgent follow-up for better outcomes.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all">Back</button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={!formData.date || !formData.time}
                    className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-heading font-black text-slate-900 mb-4">Booking Confirmed!</h2>
                <p className="text-slate-600 font-medium mb-10 max-w-sm mx-auto">
                  Your appointment at Apollo Hospitals has been scheduled successfully. You will receive a WhatsApp confirmation shortly.
                </p>
                <div className="bg-slate-50 rounded-3xl p-8 mb-10 text-left space-y-4 border border-slate-100 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Patient</span>
                    <span className="font-bold text-slate-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Department</span>
                    <span className="font-bold text-slate-900">{formData.department}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Time</span>
                    <span className="font-bold text-blue-600">{formData.date} at {formData.time}</span>
                  </div>
                </div>
                <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                  Return to Home <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 flex justify-center items-center gap-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> Secure Payment</span>
          <span className="flex items-center gap-2"><Stethoscope size={16} className="text-blue-500" /> Verified Doctors</span>
        </div>
      </div>
    </div>
  );
};

export default ApolloBooking;
