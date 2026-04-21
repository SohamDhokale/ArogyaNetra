import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart2, PlusCircle, RefreshCw, ChevronRight, TrendingUp, Download, Users, Search, Filter, LogOut, Settings, Bell, X, ChevronDown, User, Clock, Heart, AlertTriangle, CheckCircle, FileText, Stethoscope, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.svg';

const API_BASE_URL = 'http://localhost:8000';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState({ name: 'Dr. Sarah Wilson', role: 'Chief Analyst' });
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Advanced filters state
  const [filters, setFilters] = useState({
    riskLevel: 'all', // 'all', 'low', 'moderate', 'high'
    minAge: '',
    maxAge: '',
    location: '',
  });

  const [newPatient, setNewPatient] = useState({
    patient_id: '',
    name: '',
    location: '',
    age: 60,
    gender: 'Male',
    glucose: 110,
    blood_pressure: 80,
    bmi: 24.5,
    chronic_illnesses: 1,
    previous_admissions: 0,
    length_of_stay: 3,
    discharge_disposition: 'Home'
  });

  useEffect(() => {
    fetchPatients();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patients/`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients", error);
    }
  };

  const handlePredict = async (patientId) => {
    setLoading(true);
    setPrediction(null); // Clear old prediction
    try {
      console.log(`Fetching prediction for patient: ${patientId}`);
      const response = await axios.get(`${API_BASE_URL}/predict/${patientId}`);
      console.log("Prediction received:", response.data);
      setPrediction(response.data);
      fetchPatients();
    } catch (error) {
      console.error("Error predicting", error);
      alert("Analysis failed. Please check if the backend server is running and the patient exists.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axios.post(`${API_BASE_URL}/patients/`, newPatient);
      setIsAddingPatient(false);
      setNewPatient({
        patient_id: '', name: '', location: '', age: 60, gender: 'Male',
        glucose: 110, blood_pressure: 80, bmi: 24.5, chronic_illnesses: 1,
        previous_admissions: 0, length_of_stay: 3, discharge_disposition: 'Home'
      });
      fetchPatients();
    } catch (error) {
      console.error("Error adding patient", error);
      setFormError(error.response?.data?.detail || "Failed to add patient");
    }
  };

  const downloadReport = (patientId) => {
    window.open(`${API_BASE_URL}/reports/download/${patientId}`, '_blank');
  };

  // Apply advanced filters
  const getRiskLevel = (riskScore) => {
    if (!riskScore) return 'low';
    if (riskScore > 60) return 'high';
    if (riskScore > 30) return 'moderate';
    return 'low';
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = filters.riskLevel === 'all' || 
                       getRiskLevel(p.risk_score) === filters.riskLevel;
    
    const matchesAge = (!filters.minAge || p.age >= parseInt(filters.minAge)) &&
                      (!filters.maxAge || p.age <= parseInt(filters.maxAge));
    
    const matchesLocation = !filters.location || 
                           p.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesRisk && matchesAge && matchesLocation;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const riskStats = {
    high: patients.filter(p => p.risk_score && p.risk_score > 60).length,
    moderate: patients.filter(p => p.risk_score && p.risk_score > 30 && p.risk_score <= 60).length,
    low: patients.filter(p => !p.risk_score || p.risk_score <= 30).length,
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} font-sans ${isDark ? 'text-slate-50' : 'text-slate-900'} transition-colors duration-300`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 ${isDark ? 'bg-slate-900' : 'bg-slate-900'} text-white p-6 hidden md:flex flex-col h-full shrink-0 overflow-y-auto`}>
          <div className="flex items-center gap-3 mb-10">
            <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg overflow-hidden">
              <img src={logo} alt="ArogyaNetra Logo" className="h-10 w-auto" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">ArogyaNetra</h1>
          </div>
          
          <nav className="space-y-2 flex-1" role="navigation" aria-label="Sidebar">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
              { id: 'patients', label: 'Patients', icon: Users },
              { id: 'reports', label: 'Reports', icon: FileText },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden="true" /> {tab.label}
                </button>
              );
            })}
            <button className="flex items-center gap-3 w-full p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
              <Settings size={20} aria-hidden="true" /> Settings
            </button>
          </nav>

          <div className="mt-auto space-y-4">
            <div className={`p-4 ${isDark ? 'bg-slate-800' : 'bg-slate-800'} rounded-xl border border-slate-700`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-300">System Online</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">v1.0.4 - HIPAA</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <LogOut size={20} aria-hidden="true" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-full flex flex-col">
          {/* Top Bar */}
          <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 transition-colors duration-300`}>
            <div className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'} flex items-center gap-2`}>
              Clinical Portal <ChevronRight size={14} aria-hidden="true" /> 
              <span className={isDark ? 'text-slate-50' : 'text-slate-900'} capitalize>{activeTab}</span>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <button className={`${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'} transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2`} aria-label="Notifications">
                <Bell size={20} aria-hidden="true" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
              </button>
              <div className={`flex items-center gap-3 pl-4 md:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="text-right hidden sm:block">
                  <div className={`text-sm font-bold leading-none ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>{user.name}</div>
                  <div className={`text-[10px] uppercase tracking-tighter mt-1 font-bold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{user.role}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm border-2 border-slate-300 shadow-sm">
                  {getInitials(user.name)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8 flex-1 overflow-y-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {activeTab === 'dashboard' && 'Risk Analysis Dashboard'}
                  {activeTab === 'patients' && 'Clinical Database'}
                  {activeTab === 'reports' && 'Validated Reports'}
                </h2>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm md:text-base`}>
                  {activeTab === 'dashboard' && 'Predictive monitoring and explainable AI insights'}
                  {activeTab === 'patients' && 'Real-time access to all patient clinical profiles'}
                  {activeTab === 'reports' && 'Export and download HIPAA-compliant clinical summaries'}
                </p>
              </div>
              <button 
                onClick={() => setIsAddingPatient(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-bold active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto"
                aria-label="Add new patient"
              >
                <PlusCircle size={18} aria-hidden="true" /> New Patient
              </button>
            </header>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Risk Stats */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'High Risk', count: riskStats.high, color: 'red', icon: AlertTriangle },
                    { label: 'Moderate Risk', count: riskStats.moderate, color: 'yellow', icon: TrendingUp },
                    { label: 'Low Risk', count: riskStats.low, color: 'green', icon: CheckCircle },
                  ].map(stat => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border p-4 md:p-6 transition-colors`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</span>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color === 'red' ? 'bg-red-100 text-red-600' : stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                            <Icon size={20} aria-hidden="true" />
                          </div>
                        </div>
                        <p className="text-3xl font-bold">{stat.count}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Patients List */}
                <div className={`lg:col-span-1 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border overflow-hidden flex flex-col transition-colors`}>
                  <div className={`p-4 md:p-5 border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'} flex justify-between items-center`}>
                    <h3 className="font-bold flex items-center gap-2">
                      <Users size={18} className="text-blue-500" aria-hidden="true" /> Recent Patients
                    </h3>
                    <button onClick={fetchPatients} className={`${isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-slate-400 hover:text-blue-500 hover:bg-white'} transition-colors p-1.5 rounded-lg border ${isDark ? 'border-transparent hover:border-slate-700' : 'border-transparent hover:border-slate-100'} focus:outline-none focus:ring-2 focus:ring-blue-400`} aria-label="Refresh patients">
                      <RefreshCw size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'} max-h-[400px] md:max-h-[600px] overflow-y-auto`}>
                    {patients.length > 0 ? (
                      patients.slice(0, 10).map(p => (
                        <button 
                          key={p.patient_id}
                          onClick={() => setSelectedPatient(p)}
                          className={`w-full p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            selectedPatient?.patient_id === p.patient_id 
                              ? `${isDark ? 'bg-slate-800' : 'bg-blue-50'} border-r-4 border-blue-600` 
                              : `${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-bold block">{p.name || 'Patient'}</span>
                              <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-xs mt-1`}>{p.location || 'Location'}</span>
                              <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'} mt-1 block`}>ID: {p.patient_id}</span>
                            </div>
                            {p.risk_score && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                p.risk_score > 60 ? 'bg-red-100 text-red-600' : 
                                p.risk_score > 30 ? 'bg-yellow-100 text-yellow-600' : 
                                'bg-green-100 text-green-600'
                              }`}>
                                {p.risk_score.toFixed(1)}%
                              </span>
                            )}
                          </div>
                          <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} font-medium flex-wrap`}>
                            <span className="flex items-center gap-1"><User size={12} aria-hidden="true" /> {p.age}y</span>
                            <span className="flex items-center gap-1"><Clock size={12} aria-hidden="true" /> {p.length_of_stay}d</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <div className="text-slate-400 font-bold mb-2">No patients found</div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Database Seed Pending</p>
                        <button onClick={fetchPatients} className="mt-4 text-blue-600 font-bold hover:underline flex items-center gap-1 mx-auto text-xs">
                          <RefreshCw size={12} /> Sync Engine
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Patient Details & Prediction */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedPatient ? (
                    <>
                      <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 rounded-xl border flex flex-col md:flex-row gap-6 items-start md:items-center transition-colors`}>
                        <div className="bg-blue-100 w-16 h-16 rounded-lg text-blue-600 flex items-center justify-center shadow-inner shrink-0">
                          <User size={32} aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Active Patient</div>
                          <h3 className="text-xl md:text-2xl font-bold">{selectedPatient.name}</h3>
                          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium mt-1`}>ID: {selectedPatient.patient_id} | {selectedPatient.location}</p>
                          <div className="flex gap-4 text-sm mt-3 flex-wrap">
                            <span><span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Age:</span> <span className="font-bold">{selectedPatient.age}</span></span>
                            <span><span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Gender:</span> <span className="font-bold">{selectedPatient.gender}</span></span>
                            <span><span className={isDark ? 'text-slate-400' : 'text-slate-500'}>BMI:</span> <span className="font-bold">{selectedPatient.bmi}</span></span>
                          </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto flex-col md:flex-row">
                          <button 
                            onClick={() => downloadReport(selectedPatient.patient_id)}
                            className={`${isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            aria-label="Export patient report"
                          >
                            <Download size={16} aria-hidden="true" /> Export
                          </button>
                          <button 
                            onClick={() => handlePredict(selectedPatient.patient_id)}
                            disabled={loading}
                            className="bg-slate-900 text-white px-4 md:px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-all font-bold text-sm disabled:opacity-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Analyze readmission risk"
                          >
                            {loading ? <RefreshCw size={16} className="animate-spin" aria-hidden="true" /> : <Activity size={16} aria-hidden="true" />}
                            Analyze Risk
                          </button>
                        </div>
                      </div>

                      {prediction && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-8 rounded-2xl border shadow-xl transition-all duration-500`}
                        >
                          <div className="flex items-center justify-between mb-8">
                            <h4 className="font-black text-2xl flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp size={24} className="text-blue-600" aria-hidden="true" />
                              </div>
                              Readmission Risk Analysis
                            </h4>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${
                              prediction.risk_score > 60 ? 'bg-red-50 text-red-600 border-red-100' :
                              prediction.risk_score > 30 ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                              'bg-green-50 text-green-600 border-green-100'
                            }`}>
                              {prediction.risk_label}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Score Gauge */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle
                                    cx="80" cy="80" r="70"
                                    stroke="currentColor" strokeWidth="12" fill="transparent"
                                    className="text-slate-200 dark:text-slate-700"
                                  />
                                  <motion.circle
                                    cx="80" cy="80" r="70"
                                    stroke="currentColor" strokeWidth="12" fill="transparent"
                                    strokeDasharray={440}
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 440 - (440 * prediction.risk_score) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                    className={`${
                                      prediction.risk_score > 60 ? 'text-red-500' :
                                      prediction.risk_score > 30 ? 'text-yellow-500' :
                                      'text-green-500'
                                    }`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <motion.span 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-4xl font-black text-slate-900 dark:text-white"
                                  >
                                    {prediction.risk_score.toFixed(0)}%
                                  </motion.span>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Score</span>
                                </div>
                              </div>
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[120px]">
                                Probability of readmission within 30 days
                              </p>
                            </div>

                            {/* Top Risk Factors */}
                            <div className="lg:col-span-8">
                              <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-6 flex items-center gap-2`}>
                                <AlertTriangle size={16} className="text-yellow-500" />
                                Critical Risk Drivers
                              </p>
                              <div className="space-y-5">
                                {prediction.key_factors?.map((factor, idx) => (
                                  <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                      <span className="text-slate-700 dark:text-slate-200">{factor.feature_name}</span>
                                      <span className={`px-2 py-0.5 rounded-md ${factor.impact > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, Math.abs(factor.impact) * 20)}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                        className={`h-full rounded-full ${
                                          factor.impact > 0 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Clinical Recommendations */}
                          {prediction.clinical_advice && (
                            <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex items-center justify-between mb-8">
                                <h5 className="font-bold text-xl flex items-center gap-3">
                                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <Stethoscope size={20} />
                                  </div>
                                  Clinical Recommendations
                                </h5>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  {prediction.clinical_advice.length} Targeted Actions
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(Array.isArray(prediction.clinical_advice) ? prediction.clinical_advice : [prediction.clinical_advice]).map((advice, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + (idx * 0.05) }}
                                    className={`group p-4 rounded-2xl border transition-all hover:shadow-md ${
                                      isDark 
                                        ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800' 
                                        : 'bg-white border-slate-100 hover:border-blue-200'
                                    }`}
                                  >
                                    <div className="flex gap-4">
                                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                                        advice.category === 'Follow-up' ? 'bg-blue-100 text-blue-600' :
                                        advice.category === 'Medication' ? 'bg-purple-100 text-purple-600' :
                                        advice.category === 'Monitoring' ? 'bg-amber-100 text-amber-600' :
                                        'bg-emerald-100 text-emerald-600'
                                      }`}>
                                        {advice.category?.[0] || 'A'}
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                          {advice.category || 'Action'}
                                        </p>
                                        <p className={`text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                          {typeof advice === 'string' ? advice : advice.recommendation}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border p-12 text-center`}>
                      <Heart size={48} className="mx-auto mb-4 text-slate-300" aria-hidden="true" />
                      <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select a patient to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="space-y-6">
                {/* Search & Filters */}
                <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border p-4 md:p-6 transition-colors`}>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" aria-hidden="true" />
                      <input
                        type="text"
                        placeholder="Search by patient ID, name, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                        aria-label="Search patients"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        isDark
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                      aria-label={showFilters ? 'Hide filters' : 'Show filters'}
                      aria-expanded={showFilters}
                    >
                      <Filter size={18} aria-hidden="true" /> {showFilters ? 'Hide' : 'Show'} Filters
                    </button>
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Risk Level</label>
                        <select
                          value={filters.riskLevel}
                          onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-slate-50'
                              : 'bg-white border-slate-200 text-slate-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                        >
                          <option value="all">All Levels</option>
                          <option value="low">Low Risk</option>
                          <option value="moderate">Moderate Risk</option>
                          <option value="high">High Risk</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Min Age</label>
                        <input
                          type="number"
                          min="0"
                          max="150"
                          value={filters.minAge}
                          onChange={(e) => setFilters({...filters, minAge: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                          placeholder="Min age"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Max Age</label>
                        <input
                          type="number"
                          min="0"
                          max="150"
                          value={filters.maxAge}
                          onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                          placeholder="Max age"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Location</label>
                        <input
                          type="text"
                          value={filters.location}
                          onChange={(e) => setFilters({...filters, location: e.target.value})}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                          placeholder="Filter by location"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Patients Table */}
                <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border overflow-x-auto transition-colors`}>
                  <table className="w-full text-sm">
                    <thead className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b`}>
                      <tr>
                        <th className="px-4 py-3 text-left font-bold">Patient ID</th>
                        <th className="px-4 py-3 text-left font-bold">Name</th>
                        <th className="px-4 py-3 text-left font-bold">Age</th>
                        <th className="px-4 py-3 text-left font-bold">Location</th>
                        <th className="px-4 py-3 text-left font-bold">Risk Score</th>
                        <th className="px-4 py-3 text-left font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map(p => (
                          <tr key={p.patient_id} className={`hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} transition-colors`}>
                            <td className="px-4 py-3 font-bold text-blue-600">{p.patient_id}</td>
                            <td className="px-4 py-3">{p.name || '-'}</td>
                            <td className="px-4 py-3">{p.age}</td>
                            <td className="px-4 py-3">{p.location || '-'}</td>
                            <td className="px-4 py-3">
                              {p.risk_score ? (
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  p.risk_score > 60 ? 'bg-red-100 text-red-700' :
                                  p.risk_score > 30 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {p.risk_score.toFixed(1)}%
                                </span>
                              ) : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => {
                                  setSelectedPatient(p);
                                  setActiveTab('dashboard');
                                }}
                                className="text-blue-600 hover:text-blue-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-12 text-center">
                            <div className={`mx-auto max-w-xs ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-2xl border-2 border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'} p-8`}>
                              <div className="text-slate-400 font-bold mb-2">No patients found</div>
                              <p className="text-sm text-slate-500 mb-4">The database might be empty or the server is disconnected.</p>
                              <button onClick={fetchPatients} className="text-blue-600 font-bold hover:underline flex items-center gap-2 mx-auto">
                                <RefreshCw size={16} /> Retry Fetch
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border p-6 md:p-8 text-center transition-colors`}>
                <FileText size={48} className="mx-auto mb-4 text-slate-300" aria-hidden="true" />
                <h3 className="font-bold text-lg mb-2">Generate Reports</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mb-6`}>Select a patient from the dashboard to generate their readmission risk report</p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Patient Modal */}
      {isAddingPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border max-w-md w-full p-6 transition-colors`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-patient-title"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 id="add-patient-title" className="text-xl font-bold">Add New Patient</h2>
              <button
                onClick={() => setIsAddingPatient(false)}
                className={`p-1 rounded hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors`}
                aria-label="Close"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddPatient} className="space-y-4 max-h-[70vh] overflow-y-auto">
              {[
                { key: 'patient_id', label: 'Patient ID', type: 'text', required: true },
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'location', label: 'Location', type: 'text' },
                { key: 'age', label: 'Age', type: 'number', min: 0, max: 150 },
                { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                { key: 'glucose', label: 'Glucose (mg/dL)', type: 'number' },
                { key: 'blood_pressure', label: 'Blood Pressure (mmHg)', type: 'number' },
                { key: 'bmi', label: 'BMI (kg/m²)', type: 'number', step: 0.1 },
                { key: 'chronic_illnesses', label: 'Chronic Illnesses', type: 'number', min: 0, max: 10, help: 'Number of chronic conditions' },
                { key: 'previous_admissions', label: 'Previous Admissions', type: 'number', min: 0, max: 100, help: 'Number of previous hospital admissions' },
                { key: 'length_of_stay', label: 'Length of Stay (days)', type: 'number', min: 1, max: 365, help: 'Current hospital stay duration in days' },
                { key: 'discharge_disposition', label: 'Discharge Disposition', type: 'select', options: ['Home', 'Skilled Nursing Facility', 'Intermediate Care Facility', 'Inpatient Rehabilitation', 'Long-term Care', 'Home Health'] },
              ].map(field => (
                <div key={field.key}>
                  <label className={`block text-sm font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={newPatient[field.key]}
                      onChange={(e) => setNewPatient({...newPatient, [field.key]: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-slate-50'
                          : 'bg-white border-slate-200 text-slate-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    >
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={newPatient[field.key]}
                      onChange={(e) => setNewPatient({...newPatient, [field.key]: e.target.value})}
                      required={field.required}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    />
                  )}
                  {field.help && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{field.help}</p>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingPatient(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isDark
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
