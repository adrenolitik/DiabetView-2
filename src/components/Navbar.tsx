import React from 'react';
import { PatientProfile } from '../types';
import { Activity, Shield, Cpu, CalendarCheck, Sparkles, UserCheck, Star, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'cld' | 'counterfactual' | 'twin' | 'adherence' | 'ai';
  setActiveTab: (tab: 'cld' | 'counterfactual' | 'twin' | 'adherence' | 'ai') => void;
  currentPatient: PatientProfile;
  patients: PatientProfile[];
  onSelectPatient: (p: PatientProfile) => void;
  starRating: number;
  onOpenCustomPatientModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentPatient,
  patients,
  onSelectPatient,
  starRating,
  onOpenCustomPatientModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Bar with Brand, Patient Switcher & Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                DiabetView <span className="text-indigo-600 font-extrabold">2</span>
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">
                Приверженность СД2
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Платформа Bento Grid: CLD • What-If • Digital Twin • AI
            </p>
          </div>
        </div>

        {/* Patient Selector & Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Patient Selector Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <select
              aria-label="Выберите профиль пациента"
              value={currentPatient.id}
              onChange={(e) => {
                const p = patients.find((x) => x.id === e.target.value);
                if (p) onSelectPatient(p);
              }}
              className="bg-transparent text-slate-800 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-800 font-medium">
                  {p.name} ({p.age} л, HbA1c {p.hba1c}%)
                </option>
              ))}
            </select>
            <button
              onClick={onOpenCustomPatientModal}
              className="ml-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold underline transition-colors"
              title="Настроить показатели"
            >
              Свои данные
            </button>
          </div>

          {/* Metrics Pills */}
          <div className="flex items-center space-x-2">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">HbA1c:</span>
              <span className={`font-extrabold ${currentPatient.hba1c > 8.0 ? 'text-rose-600' : currentPatient.hba1c > 7.0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {currentPatient.hba1c}%
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1 text-xs font-semibold" title="Звездный рейтинг">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-amber-600 font-extrabold">{starRating}/5</span>
            </div>

            {/* Avatar Pill */}
            <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-200 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentPatient.name)}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
            <button
              onClick={() => setActiveTab('cld')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'cld'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>1. Карта Диабета (CLD)</span>
            </button>

            <button
              onClick={() => setActiveTab('counterfactual')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'counterfactual'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>2. Что если? (What-If)</span>
            </button>

            <button
              onClick={() => setActiveTab('twin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'twin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>3. Digital Twin</span>
            </button>

            <button
              onClick={() => setActiveTab('adherence')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'adherence'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>4. Приверженность & Трекер</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'bg-indigo-900 text-white shadow-md shadow-indigo-900/20'
                  : 'text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>ИИ-Врач (демо)</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
