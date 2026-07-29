export type NodeStatus = 'green' | 'yellow' | 'red';
export type LoopType = 'R' | 'B'; // Reinforcing vs Balancing

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male';
  hba1c: number; // e.g. 8.2%
  bmi: number; // e.g. 31
  activityMinutes: number; // e.g. 15 min/day
  carbsGrams: number; // e.g. 180 g/day
  medication: string; // e.g. "Метформин 1000 мг 2р/сут"
  avgGlucose: number; // e.g. 8.5 mmol/L
  sleepHours: number; // e.g. 6.5 h
  stressLevel: number; // 1-10 scale
}

export interface CldNode {
  id: string;
  label: string;
  category: 'diet' | 'glucose' | 'hba1c' | 'fatigue' | 'activity' | 'fear' | 'motivation' | 'complications' | 'monitoring' | 'side_effects' | 'knowledge';
  status: NodeStatus;
  valueDisplay: string;
  unit: string;
  description: string;
  leverageScore: number; // 1-10 leverage point centrality
  loopsPassed: string[];
  counterfactualHint: string;
  iconName: string;
}

export interface CldEdge {
  id: string;
  source: string;
  target: string;
  type: 'positive' | 'negative'; // '+' or '-'
  label: string;
  description: string;
}

export interface CldLoop {
  id: string;
  code: string; // e.g., "R1", "B1"
  type: LoopType;
  title: string;
  description: string;
  nodeIds: string[];
}

export interface CounterfactualScenario {
  id: string;
  title: string;
  subtitle: string;
  category: 'minimal' | 'ambitious' | 'no_change' | 'behavioral';
  targetHba1c: number;
  hba1cDelta: number; // e.g. -0.7%
  riskReductionPercent: number; // e.g. -24%
  glucoseDropMmol: number; // e.g. -1.4 mmol/L
  retinopathyRiskChange: number; // e.g. -24% or +340%
  nephropathyRiskChange: number; // e.g. -18% or +180%
  hypoRiskChange: number; // e.g. +2%
  durationMonths: number;
  requiredActions: string[];
  clinicalRationale: string;
}

export interface IteRiskMetric {
  id: string;
  complication: string;
  baselineRisk: number; // e.g. 34%
  intensifiedTherapyRisk: number; // e.g. 18%
  lifestyleChangeRisk: number; // e.g. 21%
  combinedTherapyRisk: number; // e.g. 14%
  unit: string;
}

export interface CgmPoint {
  time: string; // "00:00", "01:00", ...
  baselineGlucose: number; // mmol/L
  simulatedGlucose: number; // mmol/L
  targetMin: number; // 3.9
  targetMax: number; // 10.0
  isMeal?: boolean;
  mealName?: string;
}

export interface DigitalTwinState {
  activityMin: number;
  carbsGrams: number;
  medicationAdherence: number; // 0-100%
  sleepHours: number;
  stressLevel: number; // 1-10
  postMealWalk: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface DailyLogEntry {
  id: string;
  date: string; // "2026-07-29"
  glucoseFasting: number;
  glucoseChecked: boolean;
  walkMinutes: number;
  walkCompleted: boolean;
  carbsControlled: boolean;
  medsTaken: boolean;
  moodRating: number; // 1-5
  note?: string;
}
