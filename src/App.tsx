import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CldViewer } from './components/CldViewer';
import { CounterfactualEngineView } from './components/CounterfactualEngineView';
import { DigitalTwinView } from './components/DigitalTwinView';
import { AdherenceDashboard } from './components/AdherenceDashboard';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { CustomPatientModal } from './components/CustomPatientModal';

import { PRESET_PATIENTS, COUNTERFACTUAL_SCENARIOS, INITIAL_ITE_METRICS, DEFAULT_ACHIEVEMENTS } from './data/presetProfiles';
import { INITIAL_CLD_NODES, INITIAL_CLD_EDGES, INITIAL_CLD_LOOPS } from './data/cldData';
import { PatientProfile, DigitalTwinState, Achievement, DailyLogEntry, CounterfactualScenario } from './types';

export default function App() {
  const [patients, setPatients] = useState<PatientProfile[]>(PRESET_PATIENTS);
  const [currentPatient, setCurrentPatient] = useState<PatientProfile>(PRESET_PATIENTS[0]);

  const [activeTab, setActiveTab] = useState<'cld' | 'counterfactual' | 'twin' | 'adherence' | 'ai'>('cld');

  // Digital Twin state synchronized with active patient
  const [twinState, setTwinState] = useState<DigitalTwinState>({
    activityMin: currentPatient.activityMinutes,
    carbsGrams: currentPatient.carbsGrams,
    medicationAdherence: 90,
    sleepHours: currentPatient.sleepHours,
    stressLevel: currentPatient.stressLevel,
    postMealWalk: true,
  });

  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [selectedScenarioForAi, setSelectedScenarioForAi] = useState<CounterfactualScenario | undefined>(COUNTERFACTUAL_SCENARIOS[0]);

  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>([
    {
      id: 'log-1',
      date: '2026-07-28',
      glucoseFasting: 7.8,
      glucoseChecked: true,
      walkMinutes: 30,
      walkCompleted: true,
      carbsControlled: true,
      medsTaken: true,
      moodRating: 5,
      note: 'Прогулка 20 мин после ужина — сахар через 2ч 7.2 ммоль/л!',
    },
    {
      id: 'log-2',
      date: '2026-07-27',
      glucoseFasting: 8.4,
      glucoseChecked: true,
      walkMinutes: 15,
      walkCompleted: false,
      carbsControlled: false,
      medsTaken: true,
      moodRating: 4,
      note: 'Ужин с высокими углеводами, утомляемость вечером.',
    },
  ]);

  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Switch patient handler
  const handleSelectPatient = (p: PatientProfile) => {
    setCurrentPatient(p);
    setTwinState({
      activityMin: p.activityMinutes,
      carbsGrams: p.carbsGrams,
      medicationAdherence: 90,
      sleepHours: p.sleepHours,
      stressLevel: p.stressLevel,
      postMealWalk: true,
    });
  };

  // Update custom patient values
  const handleSaveCustomPatient = (updated: PatientProfile) => {
    setCurrentPatient(updated);
    setPatients((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setTwinState({
      activityMin: updated.activityMinutes,
      carbsGrams: updated.carbsGrams,
      medicationAdherence: 90,
      sleepHours: updated.sleepHours,
      stressLevel: updated.stressLevel,
      postMealWalk: true,
    });
  };

  const handleUpdateTwinState = (newState: Partial<DigitalTwinState>) => {
    setTwinState((prev) => ({ ...prev, ...newState }));
  };

  const handleResetTwinState = () => {
    setTwinState({
      activityMin: currentPatient.activityMinutes,
      carbsGrams: currentPatient.carbsGrams,
      medicationAdherence: 90,
      sleepHours: currentPatient.sleepHours,
      stressLevel: currentPatient.stressLevel,
      postMealWalk: true,
    });
  };

  const handleApplyScenarioToTwin = (scenario: CounterfactualScenario) => {
    if (scenario.category === 'minimal') {
      setTwinState({
        activityMin: 35,
        carbsGrams: Math.max(80, currentPatient.carbsGrams - 40),
        medicationAdherence: 95,
        sleepHours: 7,
        stressLevel: 5,
        postMealWalk: true,
      });
    } else if (scenario.category === 'ambitious') {
      setTwinState({
        activityMin: 50,
        carbsGrams: 100,
        medicationAdherence: 100,
        sleepHours: 8,
        stressLevel: 3,
        postMealWalk: true,
      });
    } else if (scenario.category === 'no_change') {
      setTwinState({
        activityMin: 5,
        carbsGrams: 240,
        medicationAdherence: 60,
        sleepHours: 5.5,
        stressLevel: 8,
        postMealWalk: false,
      });
    } else if (scenario.category === 'behavioral') {
      setTwinState((prev) => ({
        ...prev,
        postMealWalk: true,
        activityMin: Math.max(30, prev.activityMin),
      }));
    }
    setActiveTab('twin');
  };

  const handleAskGeminiAboutScenario = (scenario: CounterfactualScenario) => {
    setSelectedScenarioForAi(scenario);
    setActiveTab('ai');
  };

  const handleAddDailyLog = (newLog: Omit<DailyLogEntry, 'id'>) => {
    const entry: DailyLogEntry = {
      ...newLog,
      id: `log-${Date.now()}`,
    };
    setDailyLogs((prev) => [entry, ...prev]);

    // Unlock achievement for log submission
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === 'ach-streak-3'
          ? { ...a, unlocked: true, unlockedDate: 'Сегодня' }
          : a
      )
    );
  };

  // Compute Star Rating based on green nodes
  const greenNodesCount = INITIAL_CLD_NODES.filter((n) => n.status === 'green').length;
  const starRating = Math.min(5, Math.max(1, Math.round((greenNodesCount / INITIAL_CLD_NODES.length) * 5)));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentPatient={currentPatient}
        patients={patients}
        onSelectPatient={handleSelectPatient}
        starRating={starRating}
        onOpenCustomPatientModal={() => setCustomModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'cld' && (
          <CldViewer
            nodes={INITIAL_CLD_NODES}
            edges={INITIAL_CLD_EDGES}
            loops={INITIAL_CLD_LOOPS}
            patient={currentPatient}
            onSelectNodeForWhatIf={(nodeId) => {
              setActiveTab('counterfactual');
            }}
            onNavigateToDigitalTwin={() => setActiveTab('twin')}
          />
        )}

        {activeTab === 'counterfactual' && (
          <CounterfactualEngineView
            scenarios={COUNTERFACTUAL_SCENARIOS}
            patient={currentPatient}
            iteMetrics={INITIAL_ITE_METRICS}
            onApplyScenarioToTwin={handleApplyScenarioToTwin}
            onAskGeminiAboutScenario={handleAskGeminiAboutScenario}
          />
        )}

        {activeTab === 'twin' && (
          <DigitalTwinView
            patient={currentPatient}
            twinState={twinState}
            onUpdateTwinState={handleUpdateTwinState}
            onResetTwinState={handleResetTwinState}
            onAskGeminiAboutTwin={() => setActiveTab('ai')}
          />
        )}

        {activeTab === 'adherence' && (
          <AdherenceDashboard
            patient={currentPatient}
            achievements={achievements}
            dailyLogs={dailyLogs}
            twinState={twinState}
            onAddDailyLog={handleAddDailyLog}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantDrawer
            patient={currentPatient}
            currentScenario={selectedScenarioForAi}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-200">DiabetView 2</span> — Платформа повышения приверженности лечению сахарного диабета 2 типа.
          </div>
          <div className="text-slate-500 text-[11px]">
            Causal Loop Diagrams (CLD) • Minimum Viable Recommendations (MVR) • Continuous Glucose Twin • ИИ-консультант (демо-режим)
          </div>
        </div>
      </footer>

      {/* Custom Patient Editor Modal */}
      <CustomPatientModal
        currentPatient={currentPatient}
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onSaveCustomPatient={handleSaveCustomPatient}
      />
    </div>
  );
}
