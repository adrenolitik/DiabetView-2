import { PatientProfile, DigitalTwinState, CgmPoint } from '../types';

/**
 * Calculates estimated average glucose (eAG) from HbA1c in mmol/L
 * ADAG formula: eAG (mmol/L) = (28.7 × HbA1c - 46.7) / 18
 */
export function calculateEag(hba1c: number): number {
  const eagMg = 28.7 * hba1c - 46.7;
  return Math.max(4.0, Number((eagMg / 18.018).toFixed(1)));
}

/**
 * Estimates HbA1c from average 24h glucose (mmol/L)
 * HbA1c (%) = (eAG_mg + 46.7) / 28.7
 */
export function estimateHba1cFromGlucose(avgGlucoseMmol: number): number {
  const eagMg = avgGlucoseMmol * 18.018;
  const hba1c = (eagMg + 46.7) / 28.7;
  return Number(Math.max(5.5, Math.min(12.0, hba1c)).toFixed(1));
}

/**
 * Generates 24-hour Continuous Glucose Monitoring (CGM) comparison data
 */
export function generateCgmProfile(
  patient: PatientProfile,
  twinState: DigitalTwinState
): {
  points: CgmPoint[];
  baselineAvg: number;
  simulatedAvg: number;
  baselineTir: number; // Time-In-Range %
  simulatedTir: number;
  predictedHba1c: number;
  retinopathyRiskReduction: number;
  nephropathyRiskReduction: number;
  hypoRiskPercent: number;
} {
  const points: CgmPoint[] = [];
  let sumBase = 0;
  let sumSim = 0;
  let countBaseInTarget = 0;
  let countSimInTarget = 0;

  // Base parameters
  const baseFasting = Math.max(5.5, patient.avgGlucose - 1.5);
  const baseCarbFactor = patient.carbsGrams / 180; // normalized around 180g
  const baseActivityFactor = Math.max(0.2, 1 - patient.activityMinutes / 90);
  const baseStressOffset = (patient.stressLevel - 5) * 0.15;

  // Simulation deltas
  const carbDeltaRatio = twinState.carbsGrams / patient.carbsGrams;
  const activityBoost = twinState.activityMin / 60; // 0..1.5
  const postMealWalkBonus = twinState.postMealWalk ? 1.4 : 0;
  const medAdherenceRatio = twinState.medicationAdherence / 100;
  const sleepFactor = twinState.sleepHours >= 7 ? 0 : (7 - twinState.sleepHours) * 0.2;
  const stressFactor = twinState.stressLevel * 0.1;

  for (let hour = 0; hour < 24; hour++) {
    for (let min of [0, 30]) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const timeDecimal = hour + min / 60;

      // Base glucose curve calculation with circadian rhythm and 3 meal peaks
      let baseGlucose = baseFasting + baseStressOffset;

      // Dawn phenomenon (04:00 - 07:00)
      if (timeDecimal >= 4 && timeDecimal <= 7) {
        baseGlucose += Math.sin(((timeDecimal - 4) / 3) * Math.PI) * 0.9;
      }

      // Breakfast (08:00 peak around 09:30)
      if (timeDecimal >= 8 && timeDecimal <= 11) {
        const peak = Math.sin(((timeDecimal - 8) / 3) * Math.PI) * (3.5 * baseCarbFactor * baseActivityFactor);
        baseGlucose += Math.max(0, peak);
      }

      // Lunch (13:00 peak around 14:30)
      if (timeDecimal >= 13 && timeDecimal <= 16) {
        const peak = Math.sin(((timeDecimal - 13) / 3) * Math.PI) * (3.8 * baseCarbFactor * baseActivityFactor);
        baseGlucose += Math.max(0, peak);
      }

      // Dinner (19:00 peak around 20:30)
      if (timeDecimal >= 19 && timeDecimal <= 22) {
        const peak = Math.sin(((timeDecimal - 19) / 3) * Math.PI) * (4.2 * baseCarbFactor * baseActivityFactor);
        baseGlucose += Math.max(0, peak);
      }

      baseGlucose = Math.min(16.0, Math.max(4.2, baseGlucose));

      // Simulated counterfactual glucose
      let simGlucose = baseGlucose;

      // Carb modification impact
      simGlucose -= (baseGlucose - baseFasting) * (1 - carbDeltaRatio) * 0.65;

      // Activity impact (overall GLUT-4 uptake)
      simGlucose -= activityBoost * 0.8;

      // Post-meal dinner walk targeted reduction
      if (twinState.postMealWalk && timeDecimal >= 19.5 && timeDecimal <= 22) {
        simGlucose -= postMealWalkBonus;
      }

      // Med adherence effect
      simGlucose -= (1 - medAdherenceRatio) * -1.2;

      // Sleep & Stress impact
      simGlucose += sleepFactor + stressFactor - 0.5;

      // Clamp realistic bounds
      simGlucose = Math.min(15.0, Math.max(3.6, Number(simGlucose.toFixed(1))));
      baseGlucose = Number(baseGlucose.toFixed(1));

      sumBase += baseGlucose;
      sumSim += simGlucose;

      if (baseGlucose >= 3.9 && baseGlucose <= 10.0) countBaseInTarget++;
      if (simGlucose >= 3.9 && simGlucose <= 10.0) countSimInTarget++;

      const isMeal = (hour === 8 && min === 0) || (hour === 13 && min === 0) || (hour === 19 && min === 0);
      let mealName = undefined;
      if (hour === 8 && min === 0) mealName = 'Завтрак';
      if (hour === 13 && min === 0) mealName = 'Обед';
      if (hour === 19 && min === 0) mealName = 'Ужин';

      points.push({
        time: timeStr,
        baselineGlucose: baseGlucose,
        simulatedGlucose: simGlucose,
        targetMin: 3.9,
        targetMax: 10.0,
        isMeal,
        mealName,
      });
    }
  }

  const totalPoints = points.length;
  const baselineAvg = Number((sumBase / totalPoints).toFixed(1));
  const simulatedAvg = Number((sumSim / totalPoints).toFixed(1));
  const baselineTir = Math.round((countBaseInTarget / totalPoints) * 100);
  const simulatedTir = Math.round((countSimInTarget / totalPoints) * 100);

  const predictedHba1c = estimateHba1cFromGlucose(simulatedAvg);
  const hba1cDrop = Math.max(0, patient.hba1c - predictedHba1c);

  const retinopathyRiskReduction = Math.min(65, Math.round(hba1cDrop * 32));
  const nephropathyRiskReduction = Math.min(55, Math.round(hba1cDrop * 26));
  
  // Hypo risk calculation
  let hypoRiskPercent = 2.0;
  if (simulatedAvg < 5.2 && twinState.medicationAdherence > 90) {
    hypoRiskPercent += (5.2 - simulatedAvg) * 8;
  }
  hypoRiskPercent = Math.min(25, Math.round(hypoRiskPercent));

  return {
    points,
    baselineAvg,
    simulatedAvg,
    baselineTir,
    simulatedTir,
    predictedHba1c,
    retinopathyRiskReduction,
    nephropathyRiskReduction,
    hypoRiskPercent,
  };
}
