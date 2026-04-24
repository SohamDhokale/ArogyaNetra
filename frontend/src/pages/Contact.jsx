import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, ChevronRight } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('loading');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-8"
          >
            Get in <span className="text-blue-400 italic">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            Our dedicated clinical support team is here to help you integrate ArogyaNetra into your healthcare workflow.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Us</h3>
                    <p className="text-slate-500">support@arogyanetra.ai</p>
                    <p className="text-slate-500">partners@arogyanetra.ai</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Call Us</h3>
                    <p className="text-slate-500">+1 (888) AROGYA-AI</p>
                    <p className="text-slate-500">Mon-Fri, 9am - 6pm EST</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Our Office</h3>
                    <p className="text-slate-500">Innovation Center, Suite 402</p>
                    <p className="text-slate-500">Bangalore, KA 560001, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
              <MessageSquare className="text-blue-400 mb-6" size={40} />
              <h3 className="text-xl font-bold mb-4 italic">Need Immediate Support?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">Our clinicians and AI engineers are available 24/7 for urgent clinical integration issues.</p>
              <button className="text-blue-400 font-bold hover:underline flex items-center gap-2">
                Open Support Ticket <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
              {formState === 'success' ? (
                <div className="py-20 text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Message Received!</h3>
                  <p className="text-slate-500 text-lg mb-8">Our team will get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setFormState('idle')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                      <input required type="text" placeholder="Dr. John Doe" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Work Email</label>
                      <input required type="email" placeholder="john@hospital.com" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Subject</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900">
                      <option>General Inquiry</option>
                      <option>Partnership Proposal</option>
                      <option>Technical Support</option>
                      <option>Schedule a Demo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Message</label>
                    <textarea required rows="6" placeholder="How can we help you today?" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-slate-900"></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={formState === 'loading'}
                    className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {formState === 'loading' ? 'Sending...' : (
                      <>Send Message <Send size={20} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-slate-200 w-full relative overflow-hidden flex items-center justify-center group cursor-pointer">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center grayscale opacity-50 group-hover:scale-105 transition-transform duration-[2000ms]"></div>
        <div className="relative z-10 bg-white/90 backdrop-blur px-8 py-4 rounded-full shadow-2xl border border-white">
          <p className="text-slate-900 font-bold flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} /> View in Google Maps
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
